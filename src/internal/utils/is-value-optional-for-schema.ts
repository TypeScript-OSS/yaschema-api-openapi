import isPromise from 'is-promise';
import type { Schema } from 'yaschema';

/** Determines if `undefined` is a supported value for the specified schema */
export const isValueOptionalForSchema = (rootSchema: Schema): boolean => {
  const validation = rootSchema.validateAsync(undefined, { forceSync: true });
  return !isPromise(validation) && validation.error === undefined;
};
