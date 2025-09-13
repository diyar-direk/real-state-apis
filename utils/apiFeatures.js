const parsedQueryHelper = require("./parsedQueryHelper");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const parsedQuery = parsedQueryHelper(this.queryString);
    this.query = this.query.find(parsedQuery);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  fields() {
    if (this.queryString.fields) {
      const limitFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(limitFields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
