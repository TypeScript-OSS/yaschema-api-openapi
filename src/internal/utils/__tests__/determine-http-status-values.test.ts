import { schema } from 'yaschema';

import { anyHttpStatusValues } from '../../consts/open-api-http-status-ranges';
import { determineHttpStatusValues } from '../determine-http-status-values';

describe('determineHttpStatusValues', () => {
  it('should work with generic number schemas', () => {
    expect(determineHttpStatusValues(schema.number())).toMatchObject(anyHttpStatusValues);
  });

  it('should work with specific number schemas', () => {
    expect(determineHttpStatusValues(schema.number(200))).toMatchObject(['200']);
  });

  it('should work with oneOf schemas', () => {
    expect(determineHttpStatusValues(schema.oneOf(schema.number(200), schema.number(400)))).toMatchObject(['200', '400']);
  });

  it('should work with restrictedNumber schemas', () => {
    expect(determineHttpStatusValues(schema.restrictedNumber([200, 400]))).toMatchObject(['200', '400']);
  });

  it('should return anyHttpStatusValues for non-number / non-oneOf schemas', () => {
    expect(determineHttpStatusValues(schema.string())).toMatchObject(anyHttpStatusValues);
  });
});
