import type { OpenAPIV3_1 } from 'openapi-types';

import type { Field } from '../internal-types/Field';
import { buildComponentSchemaIfNeeded } from './build-component-schema-if-needed';
import { makeComponentsRefPathForSchema } from './make-components-ref-path-for-schema';

export const makeComponentsRefPathForField = (
  field: Field,
  { defaultRefName, inOutComponentSchemas }: { defaultRefName: string; inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
) => {
  if (!field.isOptional) {
    return makeComponentsRefPathForSchema(field.schema, { defaultRefName, inOutComponentSchemas });
  }

  return buildComponentSchemaIfNeeded(field.schema, { refName: defaultRefName, inOutComponentSchemas });
};
