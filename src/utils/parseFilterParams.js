const parseString = (value) => {
  return typeof value === "string" ? value : undefined;
};

const parseBoolean = (value) => {
  if (typeof value !== "string") return undefined;
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  return undefined;
};
export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseString(type);
  const parsedIsFavourite = parseBoolean(isFavourite);
  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
