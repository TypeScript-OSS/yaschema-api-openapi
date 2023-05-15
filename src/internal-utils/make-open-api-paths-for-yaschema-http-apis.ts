import type { OpenAPIV3_1 } from 'openapi-types';
import type { GenericHttpApi } from 'yaschema-api';

import { openApiMethodByHttpMethod } from '../internal-consts/open-api-method-by-http-method';
import { getUrlPathnameUsingRouteType } from './get-url-pathname';
import { isUnsupportedHttpMethod } from './is-unsupported-http-method';
import { makeOpenApiOperationForApi } from './make-open-api-operation-for-api';
import { sortKeys } from './sort-keys';

export const makeOpenApiPathsForYaschemaHttpApis = (apis: GenericHttpApi[]): OpenAPIV3_1.PathsObject =>
  sortKeys(
    apis.reduce((out: Record<string, OpenAPIV3_1.PathItemObject>, api) => {
      // Note: this strips any host-related info and doesn't check whether this server is the "right" server to handle these requests
      const relativizedUrl = getUrlPathnameUsingRouteType(api.routeType, api.url);

      if (isUnsupportedHttpMethod(api.method)) {
        throw new Error(`Unsupported HTTP method (${api.method}) encountered for ${api.url}`);
      }

      out[relativizedUrl] = out[relativizedUrl] ?? {};

      const pathItem = out[relativizedUrl];

      const openApiMethod = openApiMethodByHttpMethod[api.method];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      pathItem[openApiMethod] = makeOpenApiOperationForApi(api) as any;

      return out;
    }, {})
  );
