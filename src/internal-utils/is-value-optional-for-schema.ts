import type { MarkerType, Schema, schema } from 'yaschema';
import { markerTypes } from 'yaschema';

import type { MarkerSchema } from '../internal-types/MarkerSchema';

/** Determines if `undefined` is a supported value for the specified schema */
export const isValueOptionalForSchema = (rootSchema: Schema): boolean =>
  markerTypes.has(rootSchema.schemaType) &&
  isValueOptionalForSchemaByMarkerType[rootSchema.schemaType as MarkerType](rootSchema as MarkerSchema);

// Helpers

const isValueOptionalForSchemaByMarkerType: Record<MarkerType, (schema: MarkerSchema) => boolean> = {
  optional: () => true,
  deprecated: (s) => isValueOptionalForSchema((s as schema.DeprecatedSchema<any>).schema),
  root: (s) => isValueOptionalForSchema((s as schema.RootSchema<any>).schema),
  allOf: (s) => {
    const allOfSchema = s as schema.AllOfSchema<any, any>;
    return isValueOptionalForSchema(allOfSchema.schemas[0]) && isValueOptionalForSchema(allOfSchema.schemas[1]);
  },
  oneOf: (s) => {
    const oneOfSchema = s as schema.OneOfSchema<any, any>;
    return isValueOptionalForSchema(oneOfSchema.schemas[0]) && isValueOptionalForSchema(oneOfSchema.schemas[1]);
  },
  upgraded: (s) => {
    const upgradedSchema = s as schema.UpgradedSchema<any, any>;
    return isValueOptionalForSchema(upgradedSchema.oldSchema) || isValueOptionalForSchema(upgradedSchema.newSchema);
  },
  allowEmptyString: () => false,
  allowNull: () => false,
  not: () => false
};
