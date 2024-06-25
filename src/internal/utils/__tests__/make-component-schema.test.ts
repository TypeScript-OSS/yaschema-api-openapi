import '../../init/init-build-component-schema-if-needed-impl.js';

import type { OpenAPIV3_1 } from 'openapi-types';
import { schema } from 'yaschema';

import { makeComponentSchema } from '../make-component-schema.js';

describe('makeComponentSchema', () => {
  it('should work with allOf schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.allOf(schema.object({ one: schema.string() }), schema.object({ two: schema.string() })), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      allOf: [
        {
          type: 'object',
          required: ['one'],
          properties: { one: { type: 'string', minLength: 1 } }
        },
        {
          type: 'object',
          required: ['two'],
          properties: { two: { type: 'string', minLength: 1 } }
        }
      ]
    });
  });

  it('should work with allowNull schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.allowNull(schema.boolean()), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      nullable: true,
      oneOf: [{ type: 'boolean' }]
    });
  });

  it('should work with any schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.any(), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({});
  });

  it('should work with array schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.array(), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      type: 'array',
      items: {}
    });
  });

  it('should work with array schemas with item types', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.array({ items: schema.string() }), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      type: 'array',
      items: { type: 'string', minLength: 1 }
    });
  });

  it('should work with boolean schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.boolean(), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'boolean' });
  });

  it('should work with boolean schemas with value restrictions', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.boolean(true), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'boolean', enum: [true] });
  });

  it('should work with date schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.date(), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}(:\\d{2}(.\\d{1,9})?)?(Z|[+-]\\d{2}(:\\d{2})?)?)?$'
    });
  });

  it('should work with deprecated schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.deprecated('test', schema.string()), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      type: 'string',
      minLength: 1,
      deprecated: true
    });
  });

  it('should work with not schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.string().not(schema.string('hello')), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      allOf: [{ type: 'string', minLength: 1 }, { not: { type: 'string', enum: ['hello'], minLength: 5 } }]
    });
  });

  it('should work with number schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.number(), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'number' });
  });

  it('should work with number schemas with value restrictions', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.number(1, 3, 5), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'number', enum: [1, 3, 5] });
  });

  it('should work with object schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.object({ one: schema.string(), two: schema.number() }), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      type: 'object',
      required: ['one', 'two'],
      properties: {
        one: { type: 'string', minLength: 1 },
        two: { type: 'number' }
      }
    });
  });

  it('should work with object schemas with optional fields', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.object({ one: schema.string(), two: schema.number().optional() }), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      type: 'object',
      required: ['one'],
      properties: {
        one: { type: 'string', minLength: 1 },
        two: { type: 'number' }
      }
    });
  });

  it('should work with oneOf schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.oneOf(schema.string(), schema.number()), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      oneOf: [{ type: 'string', minLength: 1 }, { type: 'number' }]
    });
  });

  it('should work with record schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.record(schema.string(), schema.number()), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'object', additionalProperties: { type: 'number' } });
  });

  it('should work with regex schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.regex(/a.*b/), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'string', pattern: 'a.*b' });
  });

  it('should work with restrictedNumber schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.restrictedNumber([1, 3, { min: 5, max: 9 }]), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'number' });
  });

  it('should work with root schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.root('test', schema.object({ one: schema.string() })), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'object', required: ['one'], properties: { one: { type: 'string', minLength: 1 } } });
    expect(inOutComponentSchemas.test).toBe(theSchema);
  });

  it('should work with string schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.string(), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'string', minLength: 1 });
  });

  it('should work with string schemas with allowEmptyString', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.string().allowEmptyString(), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      type: 'string',
      minLength: 0
    });
  });

  it('should work with string schemas with value restrictions', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.string('hello', 'world'), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ type: 'string', enum: ['hello', 'world'], minLength: 5 });
  });

  it('should work with tuple schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.tuple({ items: [schema.string(), schema.number()] }), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({
      type: 'array',
      items: { oneOf: [{ type: 'string', minLength: 1 }, { type: 'number' }] },
      minLength: 2,
      maxLength: 2
    });
  });

  it('should work with upgraded schemas', () => {
    const inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
    const theSchema = makeComponentSchema(schema.upgraded('test', { old: schema.string(), new: schema.number() }), {
      inOutComponentSchemas
    });
    expect(theSchema).toMatchObject({ oneOf: [{ type: 'string', minLength: 1 }, { type: 'number' }] });
  });
});
