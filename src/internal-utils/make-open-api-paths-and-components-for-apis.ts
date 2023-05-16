import type { OpenAPIV3_1 } from 'openapi-types';
import type { GenericHttpApi } from 'yaschema-api';

import { openApiMethodByHttpMethod } from '../internal-consts/open-api-method-by-http-method';
import { getUrlPathnameUsingRouteType } from './get-url-pathname';
import { isUnsupportedHttpMethod } from './is-unsupported-http-method';
import { makeOpenApiOperationForApi } from './make-open-api-operation-for-api';
import { sortKeys } from './sort-keys';

export const makeOpenApiPathsAndComponentsForApis = (
  apis: GenericHttpApi[]
): { paths: OpenAPIV3_1.PathsObject; components: OpenAPIV3_1.ComponentsObject } => {
  const pathItems: Record<string, OpenAPIV3_1.PathItemObject> = {};
  const componentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};

  for (const api of apis) {
    // Note: this strips any host-related info and doesn't check whether this server is the "right" server to handle these requests
    const relativizedUrl = getUrlPathnameUsingRouteType(api.routeType, api.url);

    // Skipping unsupported methods (LINK and UNLINK)
    if (isUnsupportedHttpMethod(api.method)) {
      continue;
    }

    pathItems[relativizedUrl] = pathItems[relativizedUrl] ?? {};

    const pathItem = pathItems[relativizedUrl];

    const openApiMethod = openApiMethodByHttpMethod[api.method];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    pathItem[openApiMethod] = makeOpenApiOperationForApi(api, { inOutComponentSchemas: componentSchemas }) as any;
  }

  return {
    paths: sortKeys(pathItems),
    components: { schemas: sortKeys(componentSchemas) }
  };
};
