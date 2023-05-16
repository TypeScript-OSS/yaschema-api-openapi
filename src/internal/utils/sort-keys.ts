export const sortKeys = <K extends keyof any, V>(obj: Record<K, V>): Record<K, V> => {
  const output: Partial<Record<K, V>> = {};
  for (const key of Object.keys(obj).sort() as K[]) {
    output[key] = obj[key];
  }
  return output as Record<K, V>;
};
