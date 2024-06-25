import type { OpenAPIV3_1 } from 'openapi-types';
import type { GenericHttpApi } from 'yaschema-api';

import { makeOpenApiOperationParametersForApi } from './make-open-api-operation-parameters-for-api.js';
import { makeOpenApiOperationRequestBodyForApi } from './make-open-api-operation-request-body-for-api.js';
import { makeOpenApiOperationResponsesForApi } from './make-open-api-operation-responses-for-api.js';

export const makeOpenApiOperationForApi = (
  api: GenericHttpApi,
  fwd: { inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
): OpenAPIV3_1.OperationObject => {
  const parameters = makeOpenApiOperationParametersForApi(api, fwd);
  const requestBody = makeOpenApiOperationRequestBodyForApi(api, fwd);
  const responses = makeOpenApiOperationResponsesForApi(api, fwd);

  const output: OpenAPIV3_1.OperationObject = {
    description: api.description,
    summary: api.example,
    parameters,
    requestBody,
    responses
  };

  // deprecated is false by default so only adding if true, to minimize generated fields
  if ((api.deprecated ?? false) !== false) {
    output.deprecated = true;
  }

  return output;
};
