export const cleanNullFromObject = (
  obj: Record<string, any>,
): Record<string, any> => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};
