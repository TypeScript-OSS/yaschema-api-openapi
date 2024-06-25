import type { Schema, schema } from 'yaschema';

import { anyHttpStatusValues } from '../consts/open-api-http-status-ranges.js';

export const determineHttpStatusValues = (statusSchema: Schema): string[] => {
  switch (statusSchema.schemaType) {
    case 'number': {
      const numberSchema = statusSchema as schema.NumberSchema<number>;

      return numberSchema.allowedValues.length === 0 ? anyHttpStatusValues : numberSchema.allowedValues.map((v) => String(v));
    }
    default: {
      // For more complex schema types, checking every possible HTTP status using the schema validator.  It can take a few ms depending on
      // the schema being checked.
      const statusValues: string[] = [
        ...checkRange(statusSchema, 1),
        ...checkRange(statusSchema, 2),
        ...checkRange(statusSchema, 3),
        ...checkRange(statusSchema, 4),
        ...checkRange(statusSchema, 5)
      ];

      return statusValues.length === 0 ? anyHttpStatusValues : statusValues;
    }
  }
};

// Helpers

const checkRange = (statusSchema: Schema, category: number) => {
  const statusValues: string[] = [];

  const min = category * 100;
  const max = min + 99;

  let containsAll = true;
  for (let statusCode = min; statusCode <= max; statusCode += 1) {
    if (statusSchema.validate(statusCode).error === undefined) {
      statusValues.push(String(statusCode));
    } else {
      containsAll = false;
    }
  }

  return containsAll ? [`${category}XX`] : statusValues;
};
