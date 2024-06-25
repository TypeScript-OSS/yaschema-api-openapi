import { schema } from 'yaschema';

import { isValueOptionalForSchema } from '../is-value-optional-for-schema.js';

describe('isValueOptionalForSchema', () => {
  it('should work for allOf', () => {
    expect(
      isValueOptionalForSchema(schema.allOf(schema.object({ one: schema.string() }), schema.object({ two: schema.boolean() })))
    ).toBeFalsy();
    expect(
      isValueOptionalForSchema(schema.allOf(schema.object({ one: schema.string() }), schema.object({ two: schema.boolean() })).optional())
    ).toBeTruthy();
  });

  it('should work for allowNull', () => {
    expect(isValueOptionalForSchema(schema.allowNull(schema.boolean()))).toBeFalsy();
    expect(isValueOptionalForSchema(schema.allowNull(schema.boolean()).optional())).toBeTruthy();
  });

  it('should work for any', () => {
    expect(isValueOptionalForSchema(schema.any())).toBeFalsy();
    expect(isValueOptionalForSchema(schema.any().optional())).toBeTruthy();
  });

  it('should work for array', () => {
    expect(isValueOptionalForSchema(schema.array())).toBeFalsy();
    expect(isValueOptionalForSchema(schema.array().optional())).toBeTruthy();
  });

  it('should work for boolean', () => {
    expect(isValueOptionalForSchema(schema.boolean())).toBeFalsy();
    expect(isValueOptionalForSchema(schema.boolean().optional())).toBeTruthy();
  });

  it('should work for deprecated', () => {
    expect(isValueOptionalForSchema(schema.deprecated('test', schema.boolean()))).toBeTruthy();
    expect(isValueOptionalForSchema(schema.deprecated('test', schema.boolean().optional()))).toBeTruthy();
  });

  it('should work for not', () => {
    expect(isValueOptionalForSchema(schema.string().not(schema.string('hello')))).toBeFalsy();
    expect(isValueOptionalForSchema(schema.string().optional().not(schema.string('hello')))).toBeTruthy();
    expect(isValueOptionalForSchema(schema.string().not(schema.string('hello')).optional())).toBeTruthy();
  });

  it('should work for object', () => {
    expect(isValueOptionalForSchema(schema.object({ one: schema.string() }))).toBeFalsy();
    expect(isValueOptionalForSchema(schema.object({ one: schema.string() }).optional())).toBeTruthy();
  });

  it('should work for root', () => {
    expect(isValueOptionalForSchema(schema.root('test', schema.object({ one: schema.string() })))).toBeFalsy();
    expect(isValueOptionalForSchema(schema.root('test', schema.object({ one: schema.string() }).optional()))).toBeTruthy();
    expect(isValueOptionalForSchema(schema.root('test', schema.object({ one: schema.string() })).optional())).toBeTruthy();
  });

  it('should work for string', () => {
    expect(isValueOptionalForSchema(schema.string())).toBeFalsy();
    expect(isValueOptionalForSchema(schema.string().optional())).toBeTruthy();
  });

  it('should work for upgraded', () => {
    expect(isValueOptionalForSchema(schema.upgraded('test', { old: schema.boolean(), new: schema.string() }))).toBeFalsy();
    expect(isValueOptionalForSchema(schema.upgraded('test', { old: schema.boolean().optional(), new: schema.string() }))).toBeTruthy();
    expect(isValueOptionalForSchema(schema.upgraded('test', { old: schema.boolean(), new: schema.string() }).optional())).toBeTruthy();
  });
});
