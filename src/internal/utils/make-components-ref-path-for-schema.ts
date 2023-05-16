import type { OpenAPIV3_1 } from 'openapi-types';
import type { Schema, schema } from 'yaschema';

import { buildComponentSchemaIfNeeded } from './build-component-schema-if-needed';
import { makeOpenApiSafeComponentNamePrefixDerivedFrom } from './make-open-api-safe-component-name-prefix-derived-from';

export const makeComponentsRefPathForSchema = (
  schema: Schema,
  { defaultRefName, inOutComponentSchemas }: { defaultRefName: string; inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
) => {
  let refName = defaultRefName;
  if (schema.schemaType === 'root') {
    const rootSchema = schema as schema.RootSchema<any>;
    refName = makeOpenApiSafeComponentNamePrefixDerivedFrom(rootSchema.name);
  }

  return buildComponentSchemaIfNeeded(schema, { refName, inOutComponentSchemas });
};
