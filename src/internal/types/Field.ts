import type { Schema } from 'yaschema';

export interface Field<ValueT = any> {
  schema: Schema<ValueT>;
  isOptional: boolean;
}
