module.exports = (query) => {
  const queryObj = query;
  const excludedFields = ["page", "sort", "limit", "fields", "search"];
  excludedFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const parsedQuery = JSON.parse(queryStr);
  return parsedQuery;
};
