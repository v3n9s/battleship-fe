export const deepSatisfies = (
  obj1: { [k: string]: unknown },
  obj2: { [k: string]: unknown },
): boolean => {
  return Object.entries(obj2).every(([k, v]) =>
    v && typeof v === 'object' && obj1[k] && typeof obj1[k] === 'object'
      ? deepSatisfies(
          obj1[k] as { [k: string]: unknown },
          v as { [k: string]: unknown },
        )
      : obj1[k] === v,
  );
};
