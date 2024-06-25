import type { OpenAPIV3_1 } from 'openapi-types';
import type { GenericHttpApi, HttpRequestType } from 'yaschema-api';

import { isValueOptionalForSchema } from './is-value-optional-for-schema.js';
import { makeComponentsRefPathForSchema } from './make-components-ref-path-for-schema.js';
import { makeOpenApiSafeComponentNamePrefixDerivedFrom } from './make-open-api-safe-component-name-prefix-derived-from.js';

const requestContentTypeByRequestType: Record<HttpRequestType, string> = {
  binary: 'application/octet-stream',
  'form-data': 'multipart/form-data',
  json: 'application/json'
};

export const makeOpenApiOperationRequestBodyForApi = (
  api: GenericHttpApi,
  { inOutComponentSchemas }: { inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
): OpenAPIV3_1.RequestBodyObject | undefined => {
  const bodySchema = api.schemas.request.body;
  if (bodySchema === undefined) {
    return undefined;
  }

  const safeApiName = makeOpenApiSafeComponentNamePrefixDerivedFrom(api.name);

  const contentType = requestContentTypeByRequestType[api.requestType ?? 'json'];

  return {
    required: !isValueOptionalForSchema(bodySchema),
    content: {
      [contentType]: {
        schema: {
          $ref: makeComponentsRefPathForSchema(bodySchema, { defaultRefName: `${safeApiName}_RequestBody`, inOutComponentSchemas })
        }
      }
    }
  };
};
