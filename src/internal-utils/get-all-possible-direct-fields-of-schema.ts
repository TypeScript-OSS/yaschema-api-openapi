import type { Schema } from 'yaschema';

import type { Field } from '../internal-types/Field';
import { determineAllPossibleDirectFieldNamesOfSchema } from './determine-all-possible-direct-field-names-of-schema';
import { getDirectFieldByName } from './get-direct-field-by-name';

export const getAllPossibleDirectFieldsOfSchema = (schema: Schema): Record<string, Field> => {
  const output: Record<string, Field> = {};
  for (const fieldName of determineAllPossibleDirectFieldNamesOfSchema(schema)) {
    const field = getDirectFieldByName(schema, fieldName);
    if (field !== undefined) {
      output[fieldName] = field;
    }
  }

  return output;
};
