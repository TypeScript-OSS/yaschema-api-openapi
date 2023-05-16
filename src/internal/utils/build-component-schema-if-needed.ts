import type { OpenAPIV3_1 } from 'openapi-types';
import type { Schema } from 'yaschema';

export type BuildComponentSchemaIfNeeded = (
  schema: Schema,
  args: { refName: string; inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
) => string;

let globalImpl: BuildComponentSchemaIfNeeded | undefined;

export const buildComponentSchemaIfNeeded = (
  schema: Schema,
  args: { refName: string; inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
) => globalImpl!(schema, args);

export const setBuildComponentSchemaIfNeededImpl = (impl: BuildComponentSchemaIfNeeded) => {
  globalImpl = impl;
};
