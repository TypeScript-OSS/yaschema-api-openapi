import type { OpenAPIV3_1 } from 'openapi-types';

import type { ParameterizedUrlInfo } from '../../types/ParameterizedUrlInfo';

export const convertParameterizedUrlInfoToOpenApiServerObjectFormat = (info: ParameterizedUrlInfo): OpenAPIV3_1.ServerObject => ({
  url: info.url,
  description: info.description,
  variables: Object.entries(info.urlParams ?? {}).reduce((out: Record<string, OpenAPIV3_1.ServerVariableObject>, [key, value]) => {
    out[key] = { default: value.default, enum: value.allowedValues, description: value.description };
    return out;
  }, {})
});
