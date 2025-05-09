import type { schema } from 'yaschema';

export type MarkerSchema =
  | schema.AllOfSchema<any, any>
  | schema.AllowEmptyStringSchema<any>
  | schema.AllowNullSchema<any>
  | schema.DeprecatedSchema<any>
  | schema.NotSchema<any, any>
  | schema.OneOfSchema<any, any>
  | schema.OptionalSchema<any>
  | schema.RefSchema<any>
  | schema.RootSchema<any>
  | schema.UpgradedSchema<any, any>;
