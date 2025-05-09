import type { MarkerType, Schema } from 'yaschema';
import { markerTypes, schema } from 'yaschema';
import type { RefSchema } from 'yaschema/lib/schema/exports';

import type { Field } from '../types/Field';
import type { MarkerSchema } from '../types/MarkerSchema';
import type { WrapperSchema } from '../types/WrapperSchema';
import { isValueOptionalForSchema } from './is-value-optional-for-schema.js';

export const getDirectFieldByName = (rootSchema: Schema, lookForFieldName: string): Field | undefined => {
  if (markerTypes.has(rootSchema.schemaType)) {
    return getDirectFieldByNameByMarkerType[rootSchema.schemaType as MarkerType](rootSchema as MarkerSchema, lookForFieldName);
  } else if (rootSchema.schemaType === 'custom') {
    const customSchema = rootSchema as schema.CustomSchema<any, any>;
    return getDirectFieldByName(customSchema.serDes.serializedSchema(), lookForFieldName);
  } else if (rootSchema.schemaType === 'object') {
    const objectSchema = rootSchema as schema.ObjectSchema<any>;
    const valueSchema = objectSchema.map[lookForFieldName];
    if (valueSchema !== undefined) {
      return { schema: valueSchema, isOptional: isValueOptionalForSchema(valueSchema) };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

// Helpers

const getDirectFieldByNameForRefSchema = (s: MarkerSchema, lookForFieldName: string) =>
  getDirectFieldByName((s as RefSchema<any>).getSchema(), lookForFieldName);

const getDirectFieldByNameForWrapperSchema = (s: MarkerSchema, lookForFieldName: string) =>
  getDirectFieldByName((s as WrapperSchema).schema, lookForFieldName);

const getDirectFieldByNameByMarkerType: Record<MarkerType, (schema: MarkerSchema, lookForFieldName: string) => Field | undefined> = {
  allOf: (s, lookForFieldName) => {
    const allOfSchema = s as schema.AllOfSchema<any, any>;
    let outIsOptional = true;
    const schemas: Schema[] = [];
    for (const subschema of allOfSchema.schemas) {
      const found = getDirectFieldByName(subschema, lookForFieldName);
      if (found !== undefined) {
        if (!found.isOptional) {
          outIsOptional = false;
        }
        schemas.push(found.schema);
      }
    }

    if (schemas.length === 0) {
      return undefined;
    }

    const outAllOfSchema = schemas.length === 1 ? schemas[0] : schema.allOf(schemas[0], schemas[1]);

    return { schema: outAllOfSchema, isOptional: outIsOptional };
  },
  oneOf: (s, lookForFieldName) => {
    const oneOfSchema = s as schema.OneOfSchema<any, any>;
    let outIsOptional = false;
    const schemas: Schema[] = [];
    for (const subschema of oneOfSchema.schemas) {
      const found = getDirectFieldByName(subschema, lookForFieldName);
      if (found !== undefined) {
        if (found.isOptional) {
          outIsOptional = true;
        }
        schemas.push(found.schema);
      } else {
        outIsOptional = true;
      }
    }

    if (schemas.length === 0) {
      return undefined;
    }

    const outOneOfSchema = schemas.length === 1 ? schemas[0] : schema.oneOf(schemas[0], schemas[1]);

    return { schema: outOneOfSchema, isOptional: outIsOptional };
  },
  upgraded: (s, lookForFieldName) => {
    const upgradeSchema = s as schema.UpgradedSchema<any, any>;
    const foundOld = getDirectFieldByName(upgradeSchema.oldSchema, lookForFieldName);
    const foundNew = getDirectFieldByName(upgradeSchema.newSchema, lookForFieldName);
    if (foundOld !== undefined && foundNew !== undefined) {
      return {
        schema: schema.oneOf(foundOld.schema, foundNew.schema),
        isOptional: foundOld.isOptional || foundNew.isOptional
      };
    } else if (foundOld !== undefined) {
      return { schema: foundOld.schema, isOptional: true };
    } else if (foundNew !== undefined) {
      return { schema: foundNew.schema, isOptional: true };
    } else {
      return undefined;
    }
  },
  optional: (s, lookForFieldName) => {
    const found = getDirectFieldByName((s as schema.OptionalSchema<any>).schema, lookForFieldName);
    if (found === undefined) {
      return undefined;
    }

    return {
      schema: found.schema,
      isOptional: true
    };
  },
  not: () => undefined,
  allowEmptyString: getDirectFieldByNameForWrapperSchema,
  allowNull: getDirectFieldByNameForWrapperSchema,
  deprecated: getDirectFieldByNameForWrapperSchema,
  ref: getDirectFieldByNameForRefSchema,
  root: getDirectFieldByNameForWrapperSchema
};
