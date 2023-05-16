export const consolidateRedundantHttpStatusValues = (statusValues: string[]) => {
  const usedRanges = new Set<string>();
  for (const statusValue of statusValues) {
    if (statusValue.endsWith('XX')) {
      usedRanges.add(statusValue);
    }
  }

  const output = new Set<string>(Array.from(usedRanges));
  for (const statusValue of statusValues) {
    if (statusValue.endsWith('XX')) {
      continue; // Already dealt with
    }

    if (usedRanges.has(`${statusValue.charAt(0)}XX`)) {
      continue; // A range already includes this value
    }

    output.add(statusValue);
  }
  return Array.from(output);
};
