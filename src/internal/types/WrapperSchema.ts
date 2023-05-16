import type { schema } from 'yaschema';

import type { MarkerSchema } from './MarkerSchema';

export type WrapperSchema = Exclude<
  MarkerSchema,
  schema.AllOfSchema<any, any> | schema.NotSchema<any, any> | schema.OneOfSchema<any, any> | schema.UpgradedSchema<any, any>
>;
