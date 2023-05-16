import type { HttpResponseType } from 'yaschema-api';

export const responseContentTypesByRequestType: Record<HttpResponseType | 'dynamic', string> = {
  json: 'application/json',
  text: 'text/plain',
  arraybuffer: 'application/octet-stream',
  blob: 'application/octet-stream',
  document: 'text/html',
  stream: '*/*',
  dynamic: '*/*'
};
