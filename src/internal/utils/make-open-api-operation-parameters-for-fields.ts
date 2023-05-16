import type { OpenAPIV3_1 } from 'openapi-types';

import type { Field } from '../types/Field';
import type { NonBodyRequestPart } from '../types/NonBodyRequestPart';
import { isValueOptionalForSchema } from './is-value-optional-for-schema';
import { makeComponentsRefPathForField } from './make-components-ref-path-for-field';
import { makeOpenApiSafeComponentNamePrefixDerivedFrom } from './make-open-api-safe-component-name-prefix-derived-from';

export const makeOpenApiOperationParametersForFields = (
  fields: Record<string, Field>,
  {
    requestPart,
    namePrefix,
    inOutComponentSchemas
  }: { requestPart: NonBodyRequestPart; namePrefix: string; inOutComponentSchemas: Record<string, OpenAPIV3_1.SchemaObject> }
) =>
  Object.entries(fields).map(([name, field]): OpenAPIV3_1.ParameterObject => {
    const output: OpenAPIV3_1.ParameterObject = {
      in: requestPart,
      name,
      description: field.schema.description,
      example: field.schema.example,
      required: !field.isOptional && !isValueOptionalForSchema(field.schema),
      schema: {
        $ref: makeComponentsRefPathForField(field, {
          defaultRefName: `${namePrefix}${makeOpenApiSafeComponentNamePrefixDerivedFrom(name)}`,
          inOutComponentSchemas
        })
      }
    };

    // deprecated is false by default so only adding if true, to minimize generated fields
    if (field.schema.schemaType === 'deprecated') {
      output.deprecated = true;
    }

    return output;
  });
