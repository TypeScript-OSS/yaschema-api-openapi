import type { OpenAPIV3_1 } from 'openapi-types';
import type { GenericHttpApi } from 'yaschema-api';

import { defaultFailureHttpStatusValues, defaultSuccessHttpStatusValues } from '../consts/open-api-http-status-ranges';
import { responseContentTypesByRequestType } from '../consts/response-content-types-by-request-type';
import { determineHttpStatusValues } from './determine-http-status-values';
import { makeOpenApiOperationResponseForSchema } from './make-open-api-operation-response-for-schema';
import { makeOpenApiSafeComponentNamePrefixDerivedFrom } from './make-open-api-safe-component-name-prefix-derived-from';

export const makeOpenApiOperationResponsesForApi = (
  api: GenericHttpApi,
  { inOutComponentSchemas }: { inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
) => {
  const responses: OpenAPIV3_1.ResponsesObject = {};

  const safeApiName = makeOpenApiSafeComponentNamePrefixDerivedFrom(api.name);
  const contentType = responseContentTypesByRequestType[api.responseType ?? 'json'];

  const response = makeOpenApiOperationResponseForSchema(api.schemas.successResponse, {
    contentType,
    namePrefix: `${safeApiName}_SuccessResponse_`,
    inOutComponentSchemas
  });
  const successHttpStatusValues =
    api.schemas.successResponse.status !== undefined
      ? determineHttpStatusValues(api.schemas.successResponse.status)
      : defaultSuccessHttpStatusValues;
  for (const httpStatusValue of successHttpStatusValues) {
    responses[httpStatusValue] = response;
  }

  if (api.schemas.failureResponse !== undefined) {
    const response = makeOpenApiOperationResponseForSchema(api.schemas.failureResponse, {
      contentType,
      namePrefix: `${safeApiName}_FailureResponse_`,
      inOutComponentSchemas
    });
    const failureHttpStatusValues =
      api.schemas.failureResponse?.status !== undefined
        ? determineHttpStatusValues(api.schemas.failureResponse.status)
        : defaultFailureHttpStatusValues;
    for (const httpStatusValue of failureHttpStatusValues) {
      responses[httpStatusValue] = response;
    }
  }

  return responses;
};
