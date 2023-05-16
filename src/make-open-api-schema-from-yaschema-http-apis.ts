import './internal/init/init-build-component-schema-if-needed-impl';

import type { OpenAPIV3_1 } from 'openapi-types';
import type { GenericHttpApi } from 'yaschema-api';

import { convertParameterizedUrlInfoToOpenApiServerObjectFormat } from './internal/utils/convert-parameterized-url-info-to-open-api-server-object-format';
import { makeOpenApiPathsAndComponentsForApis } from './internal/utils/make-open-api-paths-and-components-for-apis';
import type { ApiSchemaOptions } from './types/ApiSchemaOptions';

export const makeOpenApiSchemaFromYaschemaHttpApis = (apis: GenericHttpApi[], options: ApiSchemaOptions): OpenAPIV3_1.Document => {
  const skipApisForRouteTypesSet = new Set(options.skipApisForRouteTypes ?? []);
  const skipApisSet = new Set(options.skipApis ?? []);

  const filteredApis = apis.filter((api) => !skipApisForRouteTypesSet.has(api.routeType) && !skipApisSet.has(api));

  const { paths, components } = makeOpenApiPathsAndComponentsForApis(filteredApis);

  return {
    openapi: '3.1.0',
    info: {
      version: options.version,
      title: options.title,
      summary: options.summary,
      description: options.description,
      license: {
        name: options.licenseName,
        identifier: options.licenseIdentifier,
        url: options.licenseUrl
      },
      termsOfService: options.termsOfServiceUrl,
      contact: {
        name: options.contactName,
        url: options.contactUrl,
        email: options.contactEmail
      }
    },
    externalDocs: options.externalDocs,
    servers: options.serverInfo?.map(convertParameterizedUrlInfoToOpenApiServerObjectFormat),
    paths,
    components
  };
};
