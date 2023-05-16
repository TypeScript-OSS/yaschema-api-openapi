import { OpenAPIV3 } from 'openapi-types';
import type { HttpMethod } from 'yaschema-api';

export type UnsupportedHttpMethod = 'LINK' | 'UNLINK';
export const unsupportedHttpMethods = new Set<HttpMethod>(['LINK', 'UNLINK']);

export const openApiMethodByHttpMethod: Record<Exclude<HttpMethod, 'LINK' | 'UNLINK'>, OpenAPIV3.HttpMethods> = {
  DELETE: OpenAPIV3.HttpMethods.DELETE,
  GET: OpenAPIV3.HttpMethods.GET,
  HEAD: OpenAPIV3.HttpMethods.HEAD,
  PATCH: OpenAPIV3.HttpMethods.PATCH,
  POST: OpenAPIV3.HttpMethods.POST,
  PUT: OpenAPIV3.HttpMethods.PUT
};
