import type { Schema } from 'yaschema';

/** Determines if `undefined` is a supported value for the specified schema */
export const isValueOptionalForSchema = (rootSchema: Schema): boolean => rootSchema.validate(undefined).error === undefined;
