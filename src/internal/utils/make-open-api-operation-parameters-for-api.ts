import type { OpenAPIV3_1 } from 'openapi-types';
import type { GenericHttpApi } from 'yaschema-api';

import { getAllPossibleDirectFieldsOfSchema } from './get-all-possible-direct-fields-of-schema.js';
import { makeOpenApiOperationParametersForFields } from './make-open-api-operation-parameters-for-fields.js';
import { makeOpenApiSafeComponentNamePrefixDerivedFrom } from './make-open-api-safe-component-name-prefix-derived-from.js';

// Helpers
export const makeOpenApiOperationParametersForApi = (
  api: GenericHttpApi,
  { inOutComponentSchemas }: { inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
): Array<OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject> => {
  const safeApiName = makeOpenApiSafeComponentNamePrefixDerivedFrom(api.name);

  const headerFields =
    api.schemas.request.headers !== undefined ? getAllPossibleDirectFieldsOfSchema(api.schemas.request.headers) : undefined;
  const paramFields = api.schemas.request.params !== undefined ? getAllPossibleDirectFieldsOfSchema(api.schemas.request.params) : undefined;
  const queryFields = api.schemas.request.query !== undefined ? getAllPossibleDirectFieldsOfSchema(api.schemas.request.query) : undefined;

  const headerParameters =
    headerFields !== undefined
      ? makeOpenApiOperationParametersForFields(headerFields, {
          requestPart: 'header',
          namePrefix: `${safeApiName}_RequestHeader_`,
          inOutComponentSchemas
        })
      : undefined;
  const pathParameters =
    paramFields !== undefined
      ? makeOpenApiOperationParametersForFields(paramFields, {
          requestPart: 'path',
          namePrefix: `${safeApiName}_RequestParam_`,
          inOutComponentSchemas
        })
      : undefined;
  const queryParameters =
    queryFields !== undefined
      ? makeOpenApiOperationParametersForFields(queryFields, {
          requestPart: 'query',
          namePrefix: `${safeApiName}_RequestQuery_`,
          inOutComponentSchemas
        })
      : undefined;

  return [...(headerParameters ?? []), ...(pathParameters ?? []), ...(queryParameters ?? [])];
};
