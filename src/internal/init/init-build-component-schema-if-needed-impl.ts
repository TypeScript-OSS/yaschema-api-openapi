import type { OpenAPIV3_1 } from 'openapi-types';
import type { Schema } from 'yaschema';

import { setBuildComponentSchemaIfNeededImpl } from '../utils/build-component-schema-if-needed.js';
import { makeComponentSchema } from '../utils/make-component-schema.js';
import { makeComponentsRefPath } from '../utils/make-components-ref-path.js';

const PLACEHOLDER: OpenAPIV3_1.SchemaObject = { $schema: 'PLACEHOLDER' };

setBuildComponentSchemaIfNeededImpl(
  (
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
  }
);
