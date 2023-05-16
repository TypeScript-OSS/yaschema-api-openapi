import type { OpenAPIV3_1 } from 'openapi-types';
import type { Schema } from 'yaschema';

import { makeComponentSchema } from './make-component-schema';
import { makeComponentsRefPath } from './make-components-ref-path';

const PLACEHOLDER: OpenAPIV3_1.SchemaObject = { $schema: 'PLACEHOLDER' };

export const buildComponentSchemaIfNeeded = (
  schema: Schema,
  { refName, inOutComponentSchemas }: { refName: string; inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
) => {
  if (refName in inOutComponentSchemas) {
    return makeComponentsRefPath(refName);
  }

  // For types with cyclical references to root types, we don't want to get into an infinite loop, so we add a placeholder during the
  // component building process as a marker that we don't need to repeat this work
  inOutComponentSchemas[refName] = PLACEHOLDER;
  inOutComponentSchemas[refName] = makeComponentSchema(schema, { inOutComponentSchemas });

  return makeComponentsRefPath(refName);
};
