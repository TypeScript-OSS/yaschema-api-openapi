import type { schema } from 'yaschema';

import type { MarkerSchema } from './MarkerSchema';

export type WrapperSchema = Exclude<
  MarkerSchema,
  | schema.AllOfSchema<any, any>
  | schema.AllowEmptyStringSchema<any>
  | schema.NotSchema<any, any>
  | schema.OneOfSchema<any, any>
  | schema.RefSchema<any>
  | schema.UpgradedSchema<any, any>
>;
