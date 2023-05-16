import type { Schema, schema } from 'yaschema';

import { anyHttpStatusValues } from '../internal-consts/open-api-http-status-ranges';
import { consolidateRedundantHttpStatusValues } from './consolidate-redundant-http-status-values';

export const determineHttpStatusValues = (statusSchema: Schema): string[] => {
  switch (statusSchema.schemaType) {
    case 'number': {
      const numberSchema = statusSchema as schema.NumberSchema<number>;

      return numberSchema.allowedValues.length === 0 ? anyHttpStatusValues : numberSchema.allowedValues.map((v) => String(v));
    }
    case 'oneOf': {
      const oneOfSchema = statusSchema as schema.OneOfSchema<any, any>;

      return consolidateRedundantHttpStatusValues([
        ...determineHttpStatusValues(oneOfSchema.schemas[0]),
        ...determineHttpStatusValues(oneOfSchema.schemas[1])
      ]);
    }
    default:
      return anyHttpStatusValues;
  }
};
