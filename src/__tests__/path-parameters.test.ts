import { schema } from 'yaschema';
import type { GenericHttpApi } from 'yaschema-api';
import { findAllApisInRoot, isHttpApi, makeHttpApi } from 'yaschema-api';

import { findOpenApiParameter } from '../__test_dependency__/find-open-api-parameter';
import { makeOpenApiSchemaFromYaschemaHttpApis } from '../make-open-api-schema-from-yaschema-http-apis';

describe('path parameters', () => {
  it('basic parameters should work', () => {
    const api1 = makeHttpApi({
      method: 'POST',
      routeType: 'test',
      url: '/post/{id}',
      schemas: {
        request: {
          params: schema.object({
            id: schema.string()
          }),
          headers: schema.object({
            authorization: schema.string().optional()
          }),
          query: schema.object({
            q: schema.string(),
            limit: schema.number().setAllowedSerializationForms(['string', 'number']).optional()
          }),
          body: schema.object({
            hello: schema.string('world')
          })
        },
        successResponse: {
          body: schema.record(schema.string(), schema.number())
        }
      }
    });
    const api2 = makeHttpApi({
      method: 'GET',
      routeType: 'test',
      url: '/get',
      schemas: {
        request: {},
        successResponse: {
          body: schema.string()
        }
      }
    });

    const httpApis = findAllApisInRoot({ api1, api2 }).filter((api) => isHttpApi(api)) as GenericHttpApi[];
    const openApiSchema = makeOpenApiSchemaFromYaschemaHttpApis(httpApis, { title: 'Test', version: '1.0.0', licenseName: 'UNLICENSED' });

    expect(openApiSchema.paths?.['/get']?.get).toBeDefined();
    expect(openApiSchema.paths?.['/get']?.get?.parameters?.length ?? 0).toBe(0);

    expect(openApiSchema.paths?.['/post/{id}']?.post).toBeDefined();
    expect(openApiSchema.paths?.['/post/{id}']?.post?.parameters?.length ?? 0).toBe(4);

    const authorization = findOpenApiParameter(openApiSchema.paths!['/post/{id}']!.post!.parameters, {
      name: 'authorization',
      requestPart: 'header'
    });
    expect(authorization).toBeDefined();
    expect(authorization?.required).toBeFalsy();

    const id = findOpenApiParameter(openApiSchema.paths!['/post/{id}']!.post!.parameters, { name: 'id', requestPart: 'path' });
    expect(id).toBeDefined();
    expect(id?.required).toBeTruthy();

    const q = findOpenApiParameter(openApiSchema.paths!['/post/{id}']!.post!.parameters, { name: 'q', requestPart: 'query' });
    expect(q).toBeDefined();
    expect(q?.required).toBeTruthy();

    const limit = findOpenApiParameter(openApiSchema.paths!['/post/{id}']!.post!.parameters, { name: 'limit', requestPart: 'query' });
    expect(limit).toBeDefined();
    expect(limit?.required).toBeFalsy();
  });

  it('more-complex parameters should work', () => {
    const api = makeHttpApi({
      method: 'POST',
      routeType: 'test',
      url: '/post',
      schemas: {
        request: {
          query: schema.oneOf(
            schema.object({
              q: schema.string(),
              limit: schema.number().setAllowedSerializationForms(['string', 'number']).optional()
            }),
            schema.object({
              numericQ: schema.boolean().setAllowedSerializationForms(['string', 'boolean']),
              q: schema.number().setAllowedSerializationForms(['string', 'number']),
              limit: schema.allOf(schema.number(), schema.number(50, 100))
            })
          )
        },
        successResponse: {
          body: schema.record(schema.string(), schema.number())
        }
      }
    });

    const httpApis = findAllApisInRoot({ api }).filter((api) => isHttpApi(api)) as GenericHttpApi[];
    const openApiSchema = makeOpenApiSchemaFromYaschemaHttpApis(httpApis, { title: 'Test', version: '1.0.0', licenseName: 'UNLICENSED' });

    expect(openApiSchema.paths?.['/post']?.post).toBeDefined();
    expect(openApiSchema.paths?.['/post']?.post?.parameters?.length ?? 0).toBe(3);

    const q = findOpenApiParameter(openApiSchema.paths!['/post']!.post!.parameters, { name: 'q', requestPart: 'query' });
    expect(q).toBeDefined();
    expect(q?.required).toBeTruthy();

    const limit = findOpenApiParameter(openApiSchema.paths!['/post']!.post!.parameters, { name: 'limit', requestPart: 'query' });
    expect(limit).toBeDefined();
    expect(limit?.required).toBeFalsy();

    const numericQ = findOpenApiParameter(openApiSchema.paths!['/post']!.post!.parameters, { name: 'numericQ', requestPart: 'query' });
    expect(numericQ).toBeDefined();
    expect(numericQ?.required).toBeFalsy();

    console.log('openApiSchema', JSON.stringify(openApiSchema, undefined, 2));
  });
});
