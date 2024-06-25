import type { OpenAPIV3_1 } from 'openapi-types';
import type { AnyBody, AnyHeaders, AnyStatus, ResponseSchemas } from 'yaschema-api';

import { getAllPossibleDirectFieldsOfSchema } from './get-all-possible-direct-fields-of-schema.js';
import { makeComponentsRefPathForField } from './make-components-ref-path-for-field.js';
import { makeComponentsRefPathForSchema } from './make-components-ref-path-for-schema.js';

export const makeOpenApiOperationResponseForSchema = (
  response: ResponseSchemas<AnyStatus, AnyHeaders, AnyBody>,
  {
    contentType,
    namePrefix,
    inOutComponentSchemas
  }: { contentType: string; namePrefix: string; inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
): OpenAPIV3_1.ResponseObject => {
  const bodySchema = response.body;
  const headerFields = response.headers !== undefined ? getAllPossibleDirectFieldsOfSchema(response.headers) : undefined;

  const headerFieldEntries = Object.entries(headerFields ?? {});

  return {
    description: bodySchema?.description ?? bodySchema?.example ?? '',
    content:
      bodySchema !== undefined
        ? {
            [contentType]: {
              schema: { $ref: makeComponentsRefPathForSchema(bodySchema, { defaultRefName: `${namePrefix}Body`, inOutComponentSchemas }) }
            }
          }
        : undefined,
    headers:
      headerFieldEntries.length > 0
        ? headerFieldEntries.reduce((out: Record<string, OpenAPIV3_1.ReferenceObject>, [headerName, field]) => {
            out[headerName] = {
              $ref: makeComponentsRefPathForField(field, { defaultRefName: `${namePrefix}Headers_${headerName}`, inOutComponentSchemas })
            };
            return out;
          }, {})
        : undefined
  };
};
