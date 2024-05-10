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
const checkboxOptions = {
  ...makeDefaultOptions('checkbox'),
  boolean: () => checkboxConfig
}
export function checkbox() {
  return checkboxOptions;
}

const createdByToName: NotionPropertyTypeDefinition<'created_by', string> = {
  type: 'created_by',
  handler: value => 'name' in value.created_by ? value.created_by.name ?? '' : ''
}
const createdByOptions = {
  ...makeDefaultOptions('created_by'),
  nameString: () => createdByToName
}
export function created_by() {
  return createdByOptions;
}

const createdTimeToString: NotionPropertyTypeDefinition<'created_time', string> = {
  type: 'created_time',
  handler: value => value.created_time
}
const createdTimeOptions = {
  ...makeDefaultOptions('created_time'),
  timeString: () => createdTimeToString
}
export function created_time() {
  return createdTimeOptions;
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
const dateOptions = {
  ...makeDefaultOptions('date'),
  dateRange: () => dateToDateRange
}
export function date() {
  return dateOptions;
}

const richTextToPlainText: NotionPropertyTypeDefinition<'rich_text', string> = {
  type: 'rich_text',
  handler: value => packPlainText(value.rich_text)
}
const richTextOptions = {
  ...makeDefaultOptions('rich_text'),
  plainText: () => richTextToPlainText
}
export function rich_text() {
  return richTextOptions;
}

const titleToPlainText: NotionPropertyTypeDefinition<'title', string> = {
  type: 'title',
  handler: value => packPlainText(value.title)
}
const titleOptions = {
  ...makeDefaultOptions('title'),
  plainText: () => titleToPlainText
}
export function title() {
  return titleOptions;
}

const relationToIds: NotionPropertyTypeDefinition<'relation', string[]> = {
  type: 'relation',
  handler: value => value.relation.map(relation => relation.id)
}
const relationOptions = {
  ...makeDefaultOptions('relation'),
  ids: () => relationToIds
}
export function relation() {
  return relationOptions;
}

const statusToNameString: NotionPropertyTypeDefinition<'status', string> = {
  type: 'status',
  handler: value => value.status?.name ?? ''
}
const statusOptions = {
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
export function status() {
  return statusOptions;
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
const formulaOptions = {
  ...makeDefaultOptions('formula'),
  string: () => formulaToString,
  booleanDefaultFalse: () => formulaToBooleanDefaultFalse,
  numberDefaultZero: () => formulaToNumberDefaultZero,
  dateRange: () => formulaToDateRange
}
export function formula() {
  return formulaOptions;
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
const filesOptions = {
  ...makeDefaultOptions('files'),
  urls: () => filesToUrls,
  singleUrl: () => filesToSingleUrl,
  notionImageUrls: () => filesToNotionImageUrls,
  singleNotionImageUrl: () => filesToSingleNotionImageUrl
}
export function files() {
  return filesOptions;
}

const selectToNameString: NotionPropertyTypeDefinition<'select', string> = {
  type: 'select',
  handler: value => value.select?.name ?? ''
}
const selectOptions = {
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
export function select() {
  return selectOptions;
}

const multiSelectToNameStrings: NotionPropertyTypeDefinition<'multi_select', string[]> = {
  type: 'multi_select',
  handler: value => value.multi_select.map(option => option.name)
}
const multiSelectOptions = {
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
export function multi_select() {
  return multiSelectOptions;
}

const emailToString: NotionPropertyTypeDefinition<'email', string> = {
  type: 'email',
  handler: value => value.email ?? ''
}
const emailOptions = {
  ...makeDefaultOptions('email'),
  string: () => emailToString
}
export function email() {
  return emailOptions;
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
const rollupOptions = {
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
export function rollup() {
  return rollupOptions;
}
