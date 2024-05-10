import type {
  DBSchemasType,
  NotionPropertyDefinition,
  NotionMutablePropertyDefinition,
  NotionPropertyTypeEnum,
  ValueHandler,
  ValueType
} from "./types";
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

const makeDefaultOptions = <T extends NotionPropertyTypeEnum>(type: T) => ({
  raw(): NotionPropertyDefinition<T, ValueType<T>> {
    return {
      type,
      handler: value => value
    }
  },
  handleUsing<R>(handler: ValueHandler<T, R>): NotionPropertyDefinition<T, R> {
    return {
      type,
      handler
    }
  },
  handleAndComposeUsing<R>(handler: ValueHandler<T, R>, composer: (value: R) => any): NotionMutablePropertyDefinition<T, R> {
    return {
      type,
      handler,
      composer
    }
  }
})

export function __id() {
  return '__id' as const;
}

const checkboxConfig: NotionMutablePropertyDefinition<'checkbox', boolean> = {
  type: 'checkbox',
  handler: value => value.checkbox,
  composer: (value) => value
}
const checkboxOptions = {
  ...makeDefaultOptions('checkbox'),
  boolean: () => checkboxConfig
}
export function checkbox() {
  return checkboxOptions;
}

const createdByToName: NotionPropertyDefinition<'created_by', string> = {
  type: 'created_by',
  handler: value => 'name' in value.created_by ? value.created_by.name ?? '' : ''
}
const createdByOptions = {
  ...makeDefaultOptions('created_by'),
  name: () => createdByToName
}
export function created_by() {
  return createdByOptions;
}

const createdTimeToString: NotionPropertyDefinition<'created_time', string> = {
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
const dateToDateRange: NotionMutablePropertyDefinition<'date', DateRange> = {
  type: 'date',
  handler: (value) => {
    return {
      start: value.date?.start ?? '',
      end: value.date?.end ?? ''
    }
  },
  composer: (value) => value
}
const dateOptions = {
  ...makeDefaultOptions('date'),
  dateRange: () => dateToDateRange
}
export function date() {
  return dateOptions;
}

const emailToString: NotionMutablePropertyDefinition<'email', string> = {
  type: 'email',
  handler: value => value.email ?? '',
  composer: (value) => value
}
const emailOptions = {
  ...makeDefaultOptions('email'),
  string: () => emailToString
}
export function email() {
  return emailOptions;
}

const filesToUrls: NotionPropertyDefinition<'files', string[]> = {
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
const filesToSingleUrl: NotionPropertyDefinition<'files', string> = {
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
const filesToNotionImageUrls: NotionPropertyDefinition<'files', string[]> = {
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
const filesToSingleNotionImageUrl: NotionPropertyDefinition<'files', string> = {
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

const formulaToString: NotionPropertyDefinition<'formula', string> = {
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
const formulaToBooleanDefaultFalse: NotionPropertyDefinition<'formula', boolean> = {
  type: 'formula',
  handler: value => value.formula.type === 'boolean' ? value.formula.boolean ?? false : false
}
const formulaToNumberDefaultZero: NotionPropertyDefinition<'formula', number> = {
  type: 'formula',
  handler: value => value.formula.type === 'number' ? value.formula.number ?? 0 : 0
}
const formulaToDateRange: NotionPropertyDefinition<'formula', DateRange> = {
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

const lastEditedByToName: NotionPropertyDefinition<'last_edited_by', string> = {
  type: 'last_edited_by',
  handler: value => 'name' in value.last_edited_by ? value.last_edited_by.name ?? '' : ''
}
const lastEditedByOptions = {
  ...makeDefaultOptions('last_edited_by'),
  name: () => lastEditedByToName
}
export function last_edited_by() {
  return lastEditedByOptions;
}

const lastEditedTimeToString: NotionPropertyDefinition<'last_edited_time', string> = {
  type: 'last_edited_time',
  handler: value => value.last_edited_time
}
const lastEditedTimeOptions = {
  ...makeDefaultOptions('last_edited_time'),
  timeString: () => lastEditedTimeToString
}
export function last_edited_time() {
  return lastEditedTimeOptions;
}

const multiSelectToNameStrings: NotionMutablePropertyDefinition<'multi_select', string[]> = {
  type: 'multi_select',
  handler: value => value.multi_select.map(option => option.name),
  composer: (value) => value.map(name => ({ name }))
}
const multiSelectOptions = {
  ...makeDefaultOptions('multi_select'),
  strings: () => multiSelectToNameStrings,
  stringEnums: <T extends string>(values: T[]): NotionPropertyDefinition<'multi_select', T> => {
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

const numberToNumberDefaultZero: NotionMutablePropertyDefinition<'number', number> = {
  type: 'number',
  handler: value => value.number ?? 0,
  composer: (value) => value
}
export function number() {
  return {
    ...makeDefaultOptions('number'),
    numberDefaultZero: () => numberToNumberDefaultZero
  }
}

const peopleToNames: NotionMutablePropertyDefinition<'people', string[]> = {
  type: 'people',
  handler: value => value.people.reduce((acc, person) => {
    if ('name' in person) {
      return acc.concat(person.name ?? '');
    }
    return acc;
  }, [] as string[]),
  composer: (value) => value.map(name => ({ name }))
}
const peopleOptions = {
  ...makeDefaultOptions('people'),
  names: () => peopleToNames
}
export function people() {
  return peopleOptions;
}

const phoneNumberToString: NotionMutablePropertyDefinition<'phone_number', string> = {
  type: 'phone_number',
  handler: value => value.phone_number ?? '',
  composer: (value) => value
}
const phoneNumberOptions = {
  ...makeDefaultOptions('phone_number'),
  string: () => phoneNumberToString
}
export function phone_number() {
  return phoneNumberOptions;
}

const relationToIds: NotionMutablePropertyDefinition<'relation', string[]> = {
  type: 'relation',
  handler: value => value.relation.map(relation => relation.id),
  composer: (value) => value.map(id => ({ id }))
}
const relationToSingleId: NotionMutablePropertyDefinition<'relation', string> = {
  type: 'relation',
  handler: value => value.relation[0].id ?? '',
  composer: (value) => [{ id: value }]
}
const relationOptions = {
  ...makeDefaultOptions('relation'),
  ids: () => relationToIds,
  singleId: () => relationToSingleId
}
export function relation() {
  return relationOptions;
}

const richTextToPlainText: NotionMutablePropertyDefinition<'rich_text', string> = {
  type: 'rich_text',
  handler: value => packPlainText(value.rich_text),
  composer: (value) => [{ text: { content: value } }]
}
const richTextOptions = {
  ...makeDefaultOptions('rich_text'),
  plainText: () => richTextToPlainText
}
export function rich_text() {
  return richTextOptions;
}

const rollupToDateRange: NotionPropertyDefinition<'rollup', DateRange> = {
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
const rollupToNumberDefaultZero: NotionPropertyDefinition<'rollup', number> = {
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
  handleArrayUsing: <R>(handler: (value: RollupArrayType) => R): NotionPropertyDefinition<'rollup', R> => {
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

const selectToNameString: NotionMutablePropertyDefinition<'select', string> = {
  type: 'select',
  handler: value => value.select?.name ?? '',
  composer: (value) => ({ name: value })
}
const selectOptions = {
  ...makeDefaultOptions('select'),
  string: () => selectToNameString,
  stringEnum: <T extends string>(values: T[]): NotionPropertyDefinition<'select', T> => {
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
  optionalStringEnum: <T extends string>(values: T[]): NotionPropertyDefinition<'status', T | undefined> => {
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

const statusToNameString: NotionMutablePropertyDefinition<'status', string> = {
  type: 'status',
  handler: value => value.status?.name ?? '',
  composer: (value) => ({ name: value })
}
const statusOptions = {
  ...makeDefaultOptions('status'),
  string: () => statusToNameString,
  stringEnum: <T extends string>(values: readonly T[]): NotionPropertyDefinition<'status', T> => {
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

const titleToPlainText: NotionMutablePropertyDefinition<'title', string> = {
  type: 'title',
  handler: value => packPlainText(value.title),
  composer: (value) => [{ text: { content: value } }]
}
const titleOptions = {
  ...makeDefaultOptions('title'),
  plainText: () => titleToPlainText
}
export function title() {
  return titleOptions;
}

const urlToString: NotionMutablePropertyDefinition<'url', string> = {
  type: 'url',
  handler: value => value.url ?? '',
  composer: (value) => value
}
const urlOptions = {
  ...makeDefaultOptions('url'),
  string: () => urlToString
}
export function url() {
  return urlOptions;
}
