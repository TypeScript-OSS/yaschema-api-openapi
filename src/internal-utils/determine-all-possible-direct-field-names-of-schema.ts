import type { MarkerType, Schema, schema } from 'yaschema';
import { markerTypes } from 'yaschema';

import type { MarkerSchema } from '../internal-types/MarkerSchema';
import type { WrapperSchema } from '../internal-types/WrapperSchema';

export const determineAllPossibleDirectFieldNamesOfSchema = (rootSchema: Schema): string[] => {
  if (markerTypes.has(rootSchema.schemaType)) {
    return determineAllPossibleDirectFieldNamesOfSchemaByMarkerType[rootSchema.schemaType as MarkerType](rootSchema as MarkerSchema);
  } else if (rootSchema.schemaType === 'custom') {
    const customSchema = rootSchema as schema.CustomSchema<any, any>;

    return determineAllPossibleDirectFieldNamesOfSchema(customSchema.serDes.serializedSchema());
  } else if (rootSchema.schemaType === 'object') {
    const objectSchema = rootSchema as schema.ObjectSchema<any>;

    return Object.keys(objectSchema.map);
  } else {
    return [];
  }
};

// Helpers

const determineAllPossibleDirectFieldNamesOfAllOfOrOneOfSchema = (s: MarkerSchema) => {
  const allOrOneOfSchema = s as schema.AllOfSchema<any, any> | schema.OneOfSchema<any, any>;
  const output: string[] = [];
  for (const subschema of allOrOneOfSchema.schemas) {
    output.push(...determineAllPossibleDirectFieldNamesOfSchema(subschema));
  }

  return output;
};

const determineAllPossibleDirectFieldNamesOfWrapperSchema = (s: MarkerSchema) => {
  const wrapperSchema = s as WrapperSchema;
  return determineAllPossibleDirectFieldNamesOfSchema(wrapperSchema.schema);
};

const determineAllPossibleDirectFieldNamesOfSchemaByMarkerType: Record<MarkerType, (s: MarkerSchema) => string[]> = {
  allOf: determineAllPossibleDirectFieldNamesOfAllOfOrOneOfSchema,
  oneOf: determineAllPossibleDirectFieldNamesOfAllOfOrOneOfSchema,
  upgraded: (s) => {
    const upgradeSchema = s as schema.UpgradedSchema<any, any>;

    return [
      ...determineAllPossibleDirectFieldNamesOfSchema(upgradeSchema.oldSchema),
      ...determineAllPossibleDirectFieldNamesOfSchema(upgradeSchema.newSchema)
    ];
  },
  not: () => [],
  allowEmptyString: determineAllPossibleDirectFieldNamesOfWrapperSchema,
  allowNull: determineAllPossibleDirectFieldNamesOfWrapperSchema,
  deprecated: determineAllPossibleDirectFieldNamesOfWrapperSchema,
  optional: determineAllPossibleDirectFieldNamesOfWrapperSchema,
  root: determineAllPossibleDirectFieldNamesOfWrapperSchema
};
