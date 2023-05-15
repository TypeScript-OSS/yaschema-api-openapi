import type { OpenAPIV3_1 } from 'openapi-types';
import type { GenericHttpApi } from 'yaschema-api';

import type { Field } from '../internal-types/Field';
import type { NonBodyRequestPart } from '../internal-types/NonBodyRequestPart';
import { getAllPossibleDirectFieldsOfSchema } from './get-all-possible-direct-fields-of-schema';
import { isValueOptionalForSchema } from './is-value-optional-for-schema';
import { makeComponentsRefPathPrefix } from './make-components-ref-path-prefix';
import { makeOpenApiSafeComponentNamePrefixDerivedFrom } from './make-open-api-safe-component-name-prefix-derived-from';

export const makeOpenApiOperationForApi = (api: GenericHttpApi): OpenAPIV3_1.OperationObject => {
  const parameters = makeOpenApiOperationParametersForApi(api);

  return {
    description: api.description,
    summary: api.example,
    parameters
  };
};

// Helpers

const makeOpenApiOperationParametersForApi = (api: GenericHttpApi): Array<OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject> => {
  const safeApiName = makeOpenApiSafeComponentNamePrefixDerivedFrom(api.name);

  const headerFields =
    api.schemas.request.headers !== undefined ? getAllPossibleDirectFieldsOfSchema(api.schemas.request.headers) : undefined;
  const paramFields = api.schemas.request.params !== undefined ? getAllPossibleDirectFieldsOfSchema(api.schemas.request.params) : undefined;
  const queryFields = api.schemas.request.query !== undefined ? getAllPossibleDirectFieldsOfSchema(api.schemas.request.query) : undefined;

  const headerParameters =
    headerFields !== undefined
      ? makeParametersForFields(headerFields, { requestPart: 'header', namePrefix: `${safeApiName}_RequestHeader_` })
      : undefined;
  const pathParameters =
    paramFields !== undefined
      ? makeParametersForFields(paramFields, { requestPart: 'path', namePrefix: `${safeApiName}_RequestParam_` })
      : undefined;
  const queryParameters =
    queryFields !== undefined
      ? makeParametersForFields(queryFields, { requestPart: 'query', namePrefix: `${safeApiName}_RequestQuery_` })
      : undefined;
  return [...(headerParameters ?? []), ...(pathParameters ?? []), ...(queryParameters ?? [])];
};

const makeParametersForFields = (
  fields: Record<string, Field>,
  { requestPart, namePrefix }: { requestPart: NonBodyRequestPart; namePrefix: string }
) =>
  Object.entries(fields).map(
    ([name, field]): OpenAPIV3_1.ParameterObject => ({
      in: requestPart,
      name,
      description: field.schema.description,
      example: field.schema.example,
      required: !field.isOptional && !isValueOptionalForSchema(field.schema),
      deprecated: field.schema.schemaType === 'deprecated',
      schema: {
        $ref: makeComponentsRefPathPrefix(`${namePrefix}${makeOpenApiSafeComponentNamePrefixDerivedFrom(name)}`)
      }
    })
  );
