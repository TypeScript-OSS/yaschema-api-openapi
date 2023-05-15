import type { HttpMethod } from 'yaschema-api';

import type { UnsupportedHttpMethod } from '../internal-consts/open-api-method-by-http-method';
import { unsupportedHttpMethods } from '../internal-consts/open-api-method-by-http-method';

export const isUnsupportedHttpMethod = (method: HttpMethod): method is UnsupportedHttpMethod => unsupportedHttpMethods.has(method);
