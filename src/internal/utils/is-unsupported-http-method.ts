import type { HttpMethod } from 'yaschema-api';

import type { UnsupportedHttpMethod } from '../consts/open-api-method-by-http-method';
import { unsupportedHttpMethods } from '../consts/open-api-method-by-http-method.js';

export const isUnsupportedHttpMethod = (method: HttpMethod): method is UnsupportedHttpMethod => unsupportedHttpMethods.has(method);
