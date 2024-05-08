import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse
} from "@notionhq/client/build/src/api-endpoints";

export type NotionPropertyTypes = PageObjectResponse['properties'][string]['type'];
export type NotionPageContent = Array<PartialBlockObjectResponse | BlockObjectResponse>;

export type ValueType<T extends NotionPropertyTypes> =
  Extract<PageObjectResponse['properties'][string], { type: T }>;
export type ValueHandler<T extends NotionPropertyTypes, R = any> = (value: ValueType<T>, option: string, pageId: string) => R;

export type NotionPropertyTypeDefinition<T extends NotionPropertyTypes, R = any> = {
  type: T
  handler: ValueHandler<T, R>
};
export type NotionPropertyTypeDefinitions = {
  [K in NotionPropertyTypes]: NotionPropertyTypeDefinition<K>;
}[NotionPropertyTypes];
export type DBSchemaValueDefinition = NotionPropertyTypeDefinitions | '__id';
export type DBSchemaType = Record<string, DBSchemaValueDefinition>;
export type DBSchemasType = Record<string, DBSchemaType>;

export type PropertyInfer<T extends DBSchemaValueDefinition> =
  T extends NotionPropertyTypeDefinitions ? ReturnType<T['handler']> : string;

export type DBInfer<T extends DBSchemaType> = {
  [K in keyof T]: PropertyInfer<T[K]>
}

export type DBObjectTypesInfer<DBS extends DBSchemasType> = {
  [K in keyof DBS]: DBInfer<DBS[K]>
}
