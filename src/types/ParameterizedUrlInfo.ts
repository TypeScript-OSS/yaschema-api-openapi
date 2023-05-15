import type { UrlInfo } from './UrlInfo';

export interface UrlParamInfo {
  default: string;
  allowedValues?: [string, ...string[]];
  description?: string;
}

export interface ParameterizedUrlInfo extends UrlInfo {
  urlParams?: Record<string, UrlParamInfo>;
}
