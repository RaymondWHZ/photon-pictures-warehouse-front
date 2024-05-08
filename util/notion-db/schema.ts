import type {DBSchemasType, NotionPropertyTypeDefinition, NotionPropertyTypes, ValueHandler, ValueType} from "./types";
import type {RichTextItemResponse} from "@notionhq/client/build/src/api-endpoints";

export function createDBSchemas<T extends DBSchemasType>(schema: T): typeof schema {
  return schema;
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

const makeDefaultOptions = <T extends NotionPropertyTypes>(type: T) => ({
  raw(): NotionPropertyTypeDefinition<T, ValueType<T>> {
    return {
      type,
      handler: value => value
    }
  },
  bindUsing<R>(handler: ValueHandler<T, R>): NotionPropertyTypeDefinition<T, R> {
    return {
      type,
      handler
    }
  }
})

export function __id() {
  return '__id' as const;
}

const checkboxConfig: NotionPropertyTypeDefinition<'checkbox', boolean> = {
  type: 'checkbox',
  handler: value => value.checkbox
}
export function checkbox() {
  return {
    ...makeDefaultOptions('checkbox'),
    boolean: () => checkboxConfig
  }
}

const createdByToName: NotionPropertyTypeDefinition<'created_by', string> = {
  type: 'created_by',
  handler: value => 'name' in value.created_by ? value.created_by.name ?? '' : ''
}
export function created_by() {
  return {
    ...makeDefaultOptions('created_by'),
    nameString: () => createdByToName
  }
}

const createdTimeToString: NotionPropertyTypeDefinition<'created_time', string> = {
  type: 'created_time',
  handler: value => value.created_time
}
export function created_time() {
  return {
    ...makeDefaultOptions('created_time'),
    timeString: () => createdTimeToString
  }
}

export type DateRange = {
  start: string
  end: string
}
const dateToDateRange: NotionPropertyTypeDefinition<'date', DateRange> = {
  type: 'date',
  handler: (value) => {
    return {
      start: value.date?.start ?? '',
      end: value.date?.end ?? ''
    }
  }
}
export function date() {
  return {
    ...makeDefaultOptions('date'),
    dateRange: () => dateToDateRange
  }
}

const richTextToPlainText: NotionPropertyTypeDefinition<'rich_text', string> = {
  type: 'rich_text',
  handler: value => packPlainText(value.rich_text)
}
export function rich_text() {
  return {
    ...makeDefaultOptions('rich_text'),
    plainText: () => richTextToPlainText
  }
}

const titleToPlainText: NotionPropertyTypeDefinition<'title', string> = {
  type: 'title',
  handler: value => packPlainText(value.title)
}
export function title() {
  return {
    ...makeDefaultOptions('title'),
    plainText: () => titleToPlainText
  }
}

const relationToIds: NotionPropertyTypeDefinition<'relation', string[]> = {
  type: 'relation',
  handler: value => value.relation.map(relation => relation.id)
}
export function relation() {
  return {
    ...makeDefaultOptions('relation'),
    ids: () => relationToIds
  }
}

const statusToNameString: NotionPropertyTypeDefinition<'status', string> = {
  type: 'status',
  handler: value => value.status?.name ?? ''
}
export function status() {
  return {
    ...makeDefaultOptions('status'),
    string: () => statusToNameString,
    stringEnum: <T extends string>(values: readonly T[]): NotionPropertyTypeDefinition<'status', T> => {
      return {
        type: 'status',
        handler: (value: ValueType<'status'>): T => {
          const name = value.status?.name;
          if (!name || !values.includes(name as T)) {
            throw Error('Invalid status: ' + name);
          }
          return name as T;
        }
      }
    },
  }
}

const numberToNumberDefaultZero: NotionPropertyTypeDefinition<'number', number> = {
  type: 'number',
  handler: value => value.number ?? 0
}
export function number() {
  return {
    ...makeDefaultOptions('number'),
    numberDefaultZero: () => numberToNumberDefaultZero
  }
}

const formulaToString: NotionPropertyTypeDefinition<'formula', string> = {
  type: 'formula',
  handler: value => {
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
  }
}
const formulaToBooleanDefaultFalse: NotionPropertyTypeDefinition<'formula', boolean> = {
  type: 'formula',
  handler: value => value.formula.type === 'boolean' ? value.formula.boolean ?? false : false
}
const formulaToNumberDefaultZero: NotionPropertyTypeDefinition<'formula', number> = {
  type: 'formula',
  handler: value => value.formula.type === 'number' ? value.formula.number ?? 0 : 0
}
const formulaToDateRange: NotionPropertyTypeDefinition<'formula', DateRange> = {
  type: 'formula',
  handler: value => {
    if (value.formula.type === 'date') {
      return {
        start: value.formula.date?.start ?? '',
        end: value.formula.date?.end ?? ''
      }
    }
    return {
      start: '',
      end: ''
    }
  }
}
export function formula() {
  return {
    ...makeDefaultOptions('formula'),
    string: () => formulaToString,
    booleanDefaultFalse: () => formulaToBooleanDefaultFalse,
    numberDefaultZero: () => formulaToNumberDefaultZero,
    dateRange: () => formulaToDateRange
  }
}

const filesToUrls: NotionPropertyTypeDefinition<'files', string[]> = {
  type: 'files',
  handler: (value) => value.files.reduce((acc, file) => {
    let result: string | undefined = undefined;
    if ('file' in file) {
      result = file.file.url;
    } else if ('external' in file) {
      result = file.external.url;
    }
    if (result === undefined) {
      return acc;
    }
    return acc.concat(result);
  }, [] as string[])
}
const filesToSingleUrl: NotionPropertyTypeDefinition<'files', string> = {
  type: 'files',
  handler: (value) => {
    const file = value.files[0];
    if (!file) {
      return '';
    }
    if ('file' in file) {
      return file.file.url;
    } else if ('external' in file) {
      return file.external.url;
    }
    return '';
  }
}
const filesToNotionImageUrls: NotionPropertyTypeDefinition<'files', string[]> = {
  type: 'files',
  handler: (value, option, pageId) => value.files.reduce((acc, file) => {
    let result: string | undefined = undefined;
    if ('file' in file) {
      result = convertNotionImage(pageId, file.file.url);
    }
    if (result === undefined) {
      return acc;
    }
    return acc.concat(result);
  }, [] as string[])
}
const filesToSingleNotionImageUrl: NotionPropertyTypeDefinition<'files', string> = {
  type: 'files',
  handler: (value, option, pageId) => {
    const file = value.files[0];
    if (!file) {
      return '';
    }
    if ('file' in file) {
      return convertNotionImage(pageId, file.file.url);
    }
    return '';
  }
}
export function files() {
  return {
    ...makeDefaultOptions('files'),
    urls: () => filesToUrls,
    singleUrl: () => filesToSingleUrl,
    notionImageUrls: () => filesToNotionImageUrls,
    singleNotionImageUrl: () => filesToSingleNotionImageUrl
  }
}

const selectToNameString: NotionPropertyTypeDefinition<'select', string> = {
  type: 'select',
  handler: value => value.select?.name ?? ''
}

export function select() {
  return {
    ...makeDefaultOptions('select'),
    string: () => selectToNameString,
    stringEnum: <T extends string>(values: T[]): NotionPropertyTypeDefinition<'select', T> => {
      return {
        type: 'select',
        handler: (value: ValueType<'select'>): T => {
          const name = value.select?.name;
          if (!name || !values.includes(name as T)) {
            throw Error('Invalid status');
          }
          return name as T;
        }
      }
    },
    optionalStringEnum: <T extends string>(values: T[]): NotionPropertyTypeDefinition<'status', T | undefined> => {
      return {
        type: 'status',
        handler: (value: ValueType<'status'>): T | undefined => {
          const name = value.status?.name;
          if (!name) {
            return undefined;
          }
          if (!values.includes(name as T)) {
            throw Error('Invalid status');
          }
          return name as T;
        }
      }
    }
  }
}

const multiSelectToNameStrings: NotionPropertyTypeDefinition<'multi_select', string[]> = {
  type: 'multi_select',
  handler: value => value.multi_select.map(option => option.name)
}
export function multi_select() {
  return {
    ...makeDefaultOptions('multi_select'),
    strings: () => multiSelectToNameStrings,
    stringEnums: <T extends string>(values: T[]): NotionPropertyTypeDefinition<'multi_select', T> => {
      return {
        type: 'multi_select',
        handler: (value: ValueType<'multi_select'>): T => {
          const names = value.multi_select.map(option => option.name);
          if (!names.every(name => values.includes(name as T))) {
            throw Error('Invalid status');
          }
          return names as any;
        }
      }
    }
  }
}

const emailToString: NotionPropertyTypeDefinition<'email', string> = {
  type: 'email',
  handler: value => value.email ?? ''
}
export function email() {
  return {
    ...makeDefaultOptions('email'),
    string: () => emailToString
  }
}

const rollupToDateRange: NotionPropertyTypeDefinition<'rollup', DateRange> = {
  type: 'rollup',
  handler: value => {
    if (value.rollup.type === 'date') {
      return {
        start: value.rollup.date?.start ?? '',
        end: value.rollup.date?.end ?? ''
      }
    }
    return {
      start: '',
      end: ''
    }
  }
}
const rollupToNumberDefaultZero: NotionPropertyTypeDefinition<'rollup', number> = {
  type: 'rollup',
  handler: value => {
    if (value.rollup.type === 'number') {
      return value.rollup.number ?? 0;
    }
    return 0;
  }
}

export type RollupArrayType = Extract<ValueType<'rollup'>['rollup'], { type: 'array' }>['array']
export function rollup() {
  return {
    ...makeDefaultOptions('rollup'),
    dateRange: () => rollupToDateRange,
    numberDefaultZero: () => rollupToNumberDefaultZero,
    bindArrayUsing: <R>(handler: (value: RollupArrayType) => R): NotionPropertyTypeDefinition<'rollup', R> => {
      return {
        type: 'rollup',
        handler: (value: ValueType<'rollup'>): R => {
          if (value.rollup.type === 'array') {
            return handler(value.rollup.array);
          }
          throw Error('Invalid rollup type');
        }
      }
    }
  }
}
