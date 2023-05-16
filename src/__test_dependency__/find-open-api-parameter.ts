import type { OpenAPIV3_1 } from 'openapi-types';

import type { NonBodyRequestPart } from '../internal/types/NonBodyRequestPart';

export const findOpenApiParameter = (
  parameters: Array<OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject> | undefined,
  { name, requestPart }: { name: string; requestPart: NonBodyRequestPart }
) =>
  parameters?.find((p) => {
    const param = p as OpenAPIV3_1.ParameterObject;
    return param.name === name && param.in === requestPart;
  }) as OpenAPIV3_1.ParameterObject | undefined;
