// Build query in class

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1. a. Filtering our API
    const queryObj = { ...this.queryString };
    /* ...creates hard copy of the object we want,
      req.query is all the parameters we passed in our url like ?price=512&page=111 */
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1. b. Advance filtering by including gte, lte, etc
    let queryStr = JSON.stringify(queryObj); // Converts object to string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    /* \b \b will only select lt or lte not ltee or lteee just the given word lt,
      g at the end will basically replace all the field because without it it
      would only do the first one and would ignore others */

    // Passing the filtered object
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2. Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('addedAt');
    }

    return this;
  }

  limitFields() {
    // 3. Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 4. Pagination

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    /* page=2&limit=5, 6-10 page 2, 11-15 page 2, 16-20 page 3 and so on,
      if limit 5 means we need 5 content and skip means how much value we need
      to skip to reach another page suppose to reach page 2 we need 5 value and for
      3rd page we need to skip 10 value */

    return this;
  }
}

module.exports = APIFeatures;
