import type {
  BlockObjectResponse, CreatePageParameters,
  DatabaseObjectResponse, ListBlockChildrenResponse,
  PageObjectResponse, PartialBlockObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  QueryDatabaseParameters,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {Client, isFullPage} from '@notionhq/client';

export type NotionPropertyTypes = PageObjectResponse['properties'][string]['type'];
export type NotionPageContent = Array<PartialBlockObjectResponse | BlockObjectResponse>;

export type ValueType<T extends NotionPropertyTypes> =
  Extract<PageObjectResponse['properties'][string], { type: T }>;
export type ValueHandler<T extends NotionPropertyTypes> = (value: ValueType<T>, option: string, pageId: string) => any;

export type CustomNotionPropertyType<T extends NotionPropertyTypes> = {
  type: T
  handler?: ValueHandler<T>
};
export type CustomNotionPropertyTypes = {
  [K in NotionPropertyTypes]: CustomNotionPropertyType<K>;
}[NotionPropertyTypes];
export type DBSchemaValueDefinition = NotionPropertyTypes | CustomNotionPropertyTypes | '__id';
export type DBSchemaType = Record<string, DBSchemaValueDefinition>;
export type DBSchemasType = Record<string, DBSchemaType>;

export type ValueHandlerMap = {
  [K in NotionPropertyTypes]: ValueHandler<K>;
}
export type ValueHandlers = ValueHandlerMap[NotionPropertyTypes]

export type FallbackHandlerResult<T extends NotionPropertyTypes, H extends ValueHandlerMap> = ReturnType<H[T]>;
export type CustomHandlerResult<T extends NotionPropertyTypes, CH extends ValueHandlers | undefined, H extends ValueHandlerMap> =
  CH extends ValueHandlers ? ReturnType<CH> : FallbackHandlerResult<T, H>;

export type PropertyInfer<T extends DBSchemaValueDefinition, H extends ValueHandlerMap> =
  T extends CustomNotionPropertyTypes ? CustomHandlerResult<T['type'], T['handler'], H> :
  T extends NotionPropertyTypes ? FallbackHandlerResult<T, H> : string;

export type DBInfer<T extends DBSchemaType, H extends ValueHandlerMap> = {
  [K in keyof T]: PropertyInfer<T[K], H>
}

export type DBSchemaInfer<T extends DBSchemasType, H extends ValueHandlerMap> = {
  [K in keyof T]: DBInfer<T[K], H>
}

export function createDBSchemas<T extends DBSchemasType>(schema: T): typeof schema {
  return schema;
}

export function createCompleteValueHandlers<C extends ValueHandlerMap>(handlers: C): typeof handlers {
  return handlers;
}

export function createPartialValueHandlers<C extends Partial<ValueHandlerMap>>(handlers: C): typeof handlers {
  return handlers;
}

export function mergeValueHandlers<C extends ValueHandlerMap, D extends Partial<ValueHandlerMap>>(a: C, b: D): typeof a & typeof b {
  return Object.assign({}, a, b);
}

function isAllFullPage(results: Array<PageObjectResponse | PartialPageObjectResponse | DatabaseObjectResponse | PartialDatabaseObjectResponse>): results is Array<PageObjectResponse> {
  return results.every(isFullPage);
}

function processRow<T extends DBSchemaType, H extends ValueHandlerMap>(
  result: PageObjectResponse,
  schema: T,
  valueHandlers: H
): DBInfer<T, H> {
  const transformedResult = {} as DBInfer<T, H>;
  for (const [key, def] of Object.entries(schema) as [keyof T, DBSchemaValueDefinition][]) {
    if (def === '__id') {
      transformedResult[key] = result.id as any;
      continue;
    }
    const type: NotionPropertyTypes = typeof def !== 'string' ? def.type : def;
    const [name, option] = key.toString().split('__', 2);
    if (!(name in result.properties)) {
      throw Error(`Property ${name} is not found`);
    }
    const value = result.properties[name] as ValueType<typeof type>;
    if (value.type !== type) {
      throw Error(`Property ${name} type mismatch: ${value.type} !== ${type}`);
    }
    const handler = ((typeof def !== 'string' && def.handler) ? def.handler : valueHandlers[type]) as ValueHandler<typeof type>;
    transformedResult[key] = handler(value, option ?? '', result.id);
  }
  return transformedResult;
}

function processRows<T extends DBSchemaType, H extends ValueHandlerMap>(
  results: Array<PageObjectResponse>,
  schema: T,
  valueHandlers: H
): DBInfer<T, H>[] {
  return results.map(result => processRow(result, schema, valueHandlers));
}

function processKVResults<
  T extends DBSchemaType,
  H extends ValueHandlerMap,
  K extends keyof T,
  V extends keyof T
>(processedResults: DBInfer<T, H>[], keyProp: K, valueProp: V) {
  const result: Record<string, DBInfer<T, H>[V]> = {};
  for (const processedResult of processedResults) {
    const key = processedResult[keyProp]
    if (typeof key !== 'string') {
      throw Error('Key is not a string');
    }
    result[key] = processedResult[valueProp];
  }
  return result;
}

function packPlainText(arr: RichTextItemResponse[]): string {
  return arr.reduce((acc, cur) => acc + cur.plain_text, '');
}

function convertNotionImage(pageId: string, preSignedUrl: string) {
  return 'https://www.notion.so/image/' +
    encodeURIComponent(preSignedUrl.split('?')[0]) +
    '?id=' +
    pageId +
    '&table=block';
}

function handlerNotImplemented(type: string): never {
  throw Error(`Not implemented: ${type} handler`);
}

export const defaultHandlers = createCompleteValueHandlers({
  checkbox: (value) => value.checkbox,
  created_by: () => handlerNotImplemented('created_by'),
  created_time: (value) => value.created_time,
  date: (value): [] | [string] | [string, string] => {
    if (value.date) {
      if (value.date.end) {
        return [value.date.start, value.date.end];
      }
      return [value.date.start];
    }
    return [];
  },
  email: (value) => value.email,
  files: (value, option, pageId) => value.files.reduce((acc, file) => {
    let result: string | undefined = undefined;
    if ('file' in file) {
      if (option === 'img') {
        result = convertNotionImage(pageId, file.file.url);
      } else {
        result = file.file.url;
      }
    } else if ('external' in file) {
      result = file.external.url;
    }
    if (result === undefined) {
      return acc;
    }
    return acc.concat(result);
  }, [] as string[]),
  formula: (value) => {
    if (value.formula.type === 'string') {
      return value.formula.string ?? '';
    } else if (value.formula.type === 'number') {
      return value.formula.number?.toString() ?? '';
    } else if (value.formula.type === 'boolean') {
      return value.formula.boolean ? 'true' : 'false';
    } else if (value.formula.type === 'date') {
      return value.formula.date?.start ?? '';
    }
    return '';
  },
  last_edited_by: () => handlerNotImplemented('last_edited_by'),
  last_edited_time: (value) => value.last_edited_time,
  multi_select: (value) => value.multi_select.map(option => option.name),
  number: (value) => value.number ?? 0,
  people: (value) => value.people.reduce((acc, person) => {
    if ('name' in person && person.name) {
      return acc.concat(person.name);
    }
    return acc;
  }, [] as string[]),
  relation: (value) => value.relation.map(relation => relation.id),
  rich_text: (value) => packPlainText(value.rich_text),
  rollup: () => handlerNotImplemented('rollup'),
  select: (value) => value.select?.name ?? '',
  status: (value) => value.status?.name ?? '',
  title: (value) => packPlainText(value.title),
  unique_id: (value) => value.unique_id.number ?? 0,
  url: (value) => value.url ?? '',
  phone_number: (value) => value.phone_number ?? '',
  button: () => handlerNotImplemented('button'),
  verification: () => handlerNotImplemented('verification'),
});

export interface NotionDBClientOptions<DBS extends DBSchemasType, CH extends Partial<ValueHandlerMap>> {
  notionToken: string;
  dbPageId: string;
  dbSchemas: DBS;
  dbPrefix?: string;
  customHandlers?: Partial<CH>;
}

export type DBObjectTypesInfer<DBS extends DBSchemasType, CH extends Partial<ValueHandlerMap> = {}> =
  DBSchemaInfer<DBS, typeof defaultHandlers & CH>;
export type NotionDBQueryParameters = Omit<QueryDatabaseParameters, 'database_id' | 'filter_properties'>
export type TypeWithContent<T, C extends string> = T & Record<C, NotionPageContent>

export function createNotionDBClient<
  DBS extends DBSchemasType,
  CH extends Partial<ValueHandlerMap>
>({ notionToken, dbPageId, dbSchemas, dbPrefix = 'db: ', customHandlers = {} }: NotionDBClientOptions<DBS, CH>) {

  type DBName = keyof DBS;
  type H = typeof defaultHandlers & typeof customHandlers;
  type DBObjectTypes = DBSchemaInfer<typeof dbSchemas, H>;

  const valueHandlers: H = mergeValueHandlers(defaultHandlers, customHandlers);

  const client = new Client({
    auth: notionToken,
    notionVersion: '2022-06-28'
  });

  const databaseIdMap = new Map<string, string>();

  async function fillDatabaseIdMap() {
    const databases = await client.blocks.children.list({
      block_id: dbPageId
    });
    for (const database of databases.results) {
      if ('type' in database && database.type === 'child_database') {
        const title = database.child_database.title;
        if (title.startsWith(dbPrefix)) {
          databaseIdMap.set(title.slice(dbPrefix.length), database.id);
        }
      }
    }
  }

  function clearDatabaseIdMap() {
    databaseIdMap.clear();
  }

  async function getDatabaseId(rawName: string) {
    if (!databaseIdMap.has(rawName)) {
      await fillDatabaseIdMap();
    }
    return databaseIdMap.get(rawName) ?? '';
  }

  async function useDatabaseId<R>(name: DBName, callback: (id: string) => Promise<R>): Promise<R> {
    try {
      const rawName = (name as string).split('__')[0];
      const id = await getDatabaseId(rawName);
      return await callback(id);
    } catch (e) {
      clearDatabaseIdMap();
      throw e;
    }
  }

  return {

    async query<T extends DBName>(db: T, params: NotionDBQueryParameters = {}): Promise<DBObjectTypes[T][]> {
      return useDatabaseId(db, async (id) => {
        const response = await client.databases.query({
          database_id: id,
          ...params
        });
        if (!isAllFullPage(response.results)) {
          throw Error('Not all results are full page');
        }
        return processRows(response.results, dbSchemas[db], valueHandlers);
      });
    },

    async queryOneById<T extends DBName>(db: T, id: string): Promise<DBObjectTypes[T]> {
      const response = await client.pages.retrieve({
        page_id: id
      });
      if (!isFullPage(response)) {
        throw Error('Not a full page');
      }
      return processRow(response, dbSchemas[db], valueHandlers);
    },

    async queryPageContentById(id: string): Promise<NotionPageContent> {
      const blockResponse = await client.blocks.children.list({
        block_id: id
      });
      return blockResponse.results;
    },

    async queryOneWithContentById<T extends DBName, C extends string>(
      db: T,
      id: string,
      contentProperty: C
    ): Promise<TypeWithContent<DBObjectTypes[T], C>> {
      const [properties, content] = await Promise.all([
        this.queryOneById(db, id),
        this.queryPageContentById(id)
      ]);
      const append = {} as Record<C, NotionPageContent>;
      append[contentProperty] = content;
      return Object.assign(properties, append);
    },

    async queryOneWithContentByUniqueId<T extends DBName, C extends string>(
      db: T,
      unique_id: number,
      contentProperty: C
    ): Promise<TypeWithContent<DBObjectTypes[T], C>> {
      return useDatabaseId(db, async (dbId) => {
        const uniqueIdProp = Object.entries(dbSchemas[db]).find(([_, type]) => type === 'unique_id')![0];
        const response = await client.databases.query({
          database_id: dbId,
          filter: {
            property: uniqueIdProp,
            unique_id: {
              equals: unique_id
            }
          }
        });
        if (response.results.length === 0) {
          throw Error('Not found');
        }
        const uniqueResult = response.results[0];
        if (!isFullPage(uniqueResult)) {
          throw Error('Not a full page');
        }
        const blockResponse = await client.blocks.children.list({
          block_id: uniqueResult.id
        });

        const result = processRow(uniqueResult, dbSchemas[db], valueHandlers);
        const append = {} as Record<C, NotionPageContent>;
        append[contentProperty] = blockResponse.results;
        return Object.assign(result, append);
      });
    },

    async queryKV<
      T extends DBName,
      DB extends DBObjectTypes[T],
      F extends keyof DB,
      G extends keyof DB
    >(db: T, keyProp: F, valueProp: G): Promise<Record<string, DB[G]>> {
      return useDatabaseId(db, async (id) => {
        const response = await client.databases.query({
          database_id: id,
        });
        if (!isAllFullPage(response.results)) {
          throw Error('Not all results are full page');
        }
        const processedResults = processRows(response.results, dbSchemas[db], valueHandlers);
        return processKVResults(processedResults, keyProp as string, valueProp as string);
      });
    },

    async queryText<T extends DBName>(db: T, title: string): Promise<NotionPageContent> {
      return useDatabaseId(db, async (id) => {
        const titleProp = Object.entries(dbSchemas[db]).find(([_, type]) => type === 'title')![0];
        const response = await client.databases.query({
          database_id: id,
          filter: {
            property: titleProp,
            title: {
              equals: title
            }
          }
        });
        if (response.results.length === 0) {
          throw Error('Not found');
        }
        const uniqueResult = response.results[0];
        const blockResponse = await client.blocks.children.list({
          block_id: uniqueResult.id
        });
        return blockResponse.results;
      });
    },

    async insertToDB<T extends DBName>(db: T, data: CreatePageParameters['properties']): Promise<string> {
      return useDatabaseId(db, async (id) => {
        const result = await client.pages.create({
          parent: {
            database_id: id
          },
          properties: data
        });
        return result.id;
      });
    }
  };
}
