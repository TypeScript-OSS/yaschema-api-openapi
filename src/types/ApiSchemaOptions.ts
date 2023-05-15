import type { Api } from 'yaschema-api';

import type { ParameterizedUrlInfo } from './ParameterizedUrlInfo';
import type { UrlInfo } from './UrlInfo';

export interface ApiSchemaOptions {
  title: string;
  summary?: string;
  description?: string;
  version: string;
  licenseName: string;
  /** An SPDX license expression for the API */
  licenseIdentifier?: string;
  licenseUrl?: string;
  termsOfServiceUrl?: string;
  contactName?: string;
  contactUrl?: string;
  contactEmail?: string;
  serverInfo?: ParameterizedUrlInfo[];
  externalDocs?: UrlInfo;

  /** OpenApi schemas won't be generated for APIs matching any of these route types */
  skipApisForRouteTypes?: string[];
  /** OpenApi schemas won't be generated for these APIs */
  skipApis?: Api[];
}
