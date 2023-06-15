import type { OpenAPIV3_1 } from 'openapi-types';
import type { Schema, SchemaType } from 'yaschema';
import { schema } from 'yaschema';

import { buildComponentSchemaIfNeeded } from './build-component-schema-if-needed';
import { isValueOptionalForSchema } from './is-value-optional-for-schema';

export const makeComponentSchema = (
  rootSchema: Schema,
  fwd: { inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
): OpenAPIV3_1.SchemaObject => makeComponentSchemaBySchemaType[rootSchema.schemaType](rootSchema, fwd);

// Helpers

/** ISO DateTime string */
const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(.\d{1,9})?)?(Z|[+-]\d{2}(:\d{2})?)?)?$/;

const enrichOpenApiSchema = (
  openApiSchema: OpenAPIV3_1.SchemaObject,
  yaschemaSchema: Schema,
  { deprecated = false }: { deprecated?: boolean } = {}
) => {
  openApiSchema.description = yaschemaSchema.description;
  openApiSchema.example = yaschemaSchema.example;
  if (deprecated) {
    openApiSchema.deprecated = deprecated;
  }
  return openApiSchema;
};

const makeComponentSchemaBySchemaType: Record<
  SchemaType,
  (s: Schema, fwd: { inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }) => OpenAPIV3_1.SchemaObject
> = {
  root: (s, { inOutComponentSchemas }) => {
    const rootSchema = s as schema.RootSchema<any>;

    const alreadyDefined = rootSchema.name in inOutComponentSchemas;
    buildComponentSchemaIfNeeded(rootSchema.schema, { refName: rootSchema.name, inOutComponentSchemas });
    const output = inOutComponentSchemas[rootSchema.name];

    if (!alreadyDefined) {
      output.description = rootSchema.description ?? output.description;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      output.example = rootSchema.example ?? output.example;
    }

    return output;
  },
  allOf: (s, fwd) => {
    const allOfSchema = s as schema.AllOfSchema<any, any>;

    return enrichOpenApiSchema({ allOf: allOfSchema.schemas.map((subschema) => makeComponentSchema(subschema, fwd)) }, s);
  },
  allowEmptyString: (s) => {
    const allowEmptyStringSchema = s as schema.AllowEmptyStringSchema<string>;

    return enrichOpenApiSchema(
      {
        type: 'string',
        enum: allowEmptyStringSchema.allowedValues.length > 0 ? [...allowEmptyStringSchema.allowedValues, ''] : undefined,
        minLength: 0
      },
      s
    );
  },
  allowNull: (s, { inOutComponentSchemas }) => {
    const allowNullSchema = s as schema.AllowNullSchema<any>;

    return enrichOpenApiSchema(makeComponentSchemaForOneOf([allowNullSchema.schema], { nullable: true, inOutComponentSchemas }), s);
  },
  any: (s) => enrichOpenApiSchema({}, s),
  array: (s, fwd) => {
    const arraySchema = s as schema.ArraySchema;

    return enrichOpenApiSchema(
      {
        type: 'array',
        items: makeComponentSchema(arraySchema.items ?? schema.any(), fwd),
        minLength: arraySchema.minLength,
        maxLength: arraySchema.maxLength
      },
      s
    );
  },
  boolean: (s) => {
    const booleanSchema = s as schema.BooleanSchema<boolean>;

    return enrichOpenApiSchema(
      {
        type: 'boolean',
        enum: booleanSchema.allowedValues.length > 0 ? booleanSchema.allowedValues : undefined
      },
      s
    );
  },
  custom: (s, fwd) => {
    const customSchema = s as schema.CustomSchema<any, any>;

    return enrichOpenApiSchema(makeComponentSchema(customSchema.serDes.serializedSchema(), fwd), s);
  },
  // JSON / OpenAPI don't directly support dates, but Date objects are encoded as ISO DateTime strings with yaschema.  Also, date range
  // values cant be restricted using OpenAPI directly.
  date: (s, fwd) => enrichOpenApiSchema(makeComponentSchema(schema.regex(dateRegex), fwd), s),
  deprecated: (s, fwd) => {
    const deprecatedSchema = s as schema.DeprecatedSchema<any>;

    return enrichOpenApiSchema(makeComponentSchema(deprecatedSchema.schema, fwd), s, { deprecated: true });
  },
  not: (s, fwd) => {
    const notSchema = s as schema.NotSchema<any, void>;

    return enrichOpenApiSchema(
      { allOf: [makeComponentSchema(notSchema.schema, fwd), { not: makeComponentSchema(notSchema.notSchema, fwd) }] },
      s
    );
  },
  number: (s) => {
    const numberSchema = s as schema.NumberSchema<number>;

    return enrichOpenApiSchema(
      {
        type: 'number',
        enum: numberSchema.allowedValues.length > 0 ? (numberSchema.allowedValues as number[]) : undefined
      },
      s
    );
  },
  object: (s, fwd) => {
    const objectSchema = s as schema.ObjectSchema<any>;

    const keys = Object.keys(objectSchema.map);

    return enrichOpenApiSchema(
      {
        type: 'object',
        required: keys.filter((key) => !isValueOptionalForSchema(objectSchema.map[key])),
        properties: keys.reduce((out: Record<string, any>, key) => {
          out[key] = makeComponentSchema(objectSchema.map[key], fwd);
          return out;
        }, {})
      },
      s
    );
  },
  oneOf: (s, fwd) => {
    const oneOfSchema = s as schema.OneOfSchema<any, any>;

    return enrichOpenApiSchema(makeComponentSchemaForOneOf(oneOfSchema.schemas, fwd), s);
  },
  optional: (s, fwd) => {
    const optionalSchema = s as schema.OptionalSchema<any>;

    // Since undefined isn't a valid JSON value, this doesn't translate well for OpenAPI.  However, checks for optional object fields and
    // request body are performed separately.  Example limitations with OpenAPI: response bodies can't be undefined directly and arrays
    // can't contained undefined values.
    return enrichOpenApiSchema(makeComponentSchema(optionalSchema.schema, fwd), s);
  },
  record: (s, fwd) => {
    const recordSchema = s as schema.RecordSchema<any, any>;

    return enrichOpenApiSchema(
      {
        type: 'object',
        additionalProperties: makeComponentSchema(recordSchema.valueSchema, fwd)
      },
      s
    );
  },
  regex: (s) => {
    const regexSchema = s as schema.RegexSchema;
    let regexString = String(regexSchema.regex);
    regexString = regexString.substring(1, regexString.length - 1); // Removing the containing '/' characters

    return enrichOpenApiSchema({ type: 'string', pattern: regexString }, s);
  },
  // OpenAPI isn't capable of fully encoding this type, so we just loosely allow all numbers.  Documentation should be used to describe
  // limitations as needed.
  restrictedNumber: (s) => enrichOpenApiSchema({ type: 'number' }, s),
  string: (s) => {
    const stringSchema = s as schema.StringSchema<string>;

    return enrichOpenApiSchema(
      {
        type: 'string',
        enum: stringSchema.allowedValues.length > 0 ? stringSchema.allowedValues : undefined,
        minLength:
          stringSchema.allowedValues.length > 0
            ? stringSchema.allowedValues.reduce((out, allowedValue) => Math.min(out, allowedValue.length), Number.MAX_SAFE_INTEGER)
            : 1
      },
      s
    );
  },
  tuple: (s, fwd) => {
    const tupleSchema = s as schema.TupleSchema<any, any, any, any, any>;

    return enrichOpenApiSchema(
      {
        type: 'array',
        // OpenAPI 3.1 is supposed to support prefixItems, but openapi-types doesn't support that yet.  Once ready, replace items with
        // prefixItems
        // prefixItems: tupleSchema.items.map((subschema) => makeComponentSchema(subschema, fwd)),
        items: makeComponentSchemaForOneOf(tupleSchema.items, fwd),
        minLength: tupleSchema.items.length,
        maxLength: tupleSchema.items.length
      },
      s
    );
  },
  upgraded: (s, fwd) => {
    const upgradedSchema = s as schema.UpgradedSchema<any, any>;

    return enrichOpenApiSchema(makeComponentSchemaForOneOf([upgradedSchema.oldSchema, upgradedSchema.newSchema], fwd), s);
  }
};

const makeComponentSchemaForOneOf = (
  schemas: Schema[],
  { nullable = false, inOutComponentSchemas }: { nullable?: boolean; inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
) => {
  // nullable is false by default, so only including if true, to minimize generated fields
  if (nullable) {
    return { nullable: true, oneOf: schemas.map((s) => makeComponentSchema(s, { inOutComponentSchemas })) };
  } else if (schemas.length > 1) {
    return { oneOf: schemas.map((s) => makeComponentSchema(s, { inOutComponentSchemas })) };
  } else {
    return makeComponentSchema(schemas[0], { inOutComponentSchemas });
  }
};
