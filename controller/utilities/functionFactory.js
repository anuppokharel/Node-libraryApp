// Imports

// User-defined modules

const AppError = require('../../utils/appError');

// Pagination

exports.paginate = (Model, option) => {
  (req, res, next) => {
    let totalDocuments;
    const page = +req.query.page || 1; // Get page number either from query or default to 1

    const doc_per_page = 5; // Document per page || Books per page || Products per page

    const viewPath = option.viewPath;
    const path = option.path;
    const title = option.title;

    Model.find()
      .countDocuments() // Counts the total number of document in a collection
      .then((numDocument) => {
        totalDocuments = numDocument;

        return Model.find()
          .skip((page - 1) * doc_per_page) // Suppose u have 5 document, if u r in page one 1-1=0 and 0*5=0 so we skip 0 doc
          .limit(doc_per_page); // Limits, limit the number of document you want to show in page
      })
      .then((documents) => {
        res.status(200).render(`${viewPath}`, {
          path: path,
          title: title,
          books: documents,
          currentPage: page,
          hasNextPage: doc_per_page * page < totalDocuments,
          /* Suppose document per page is 5 and current page is 2 and total document is 11 then in 2 page we saw 2*5=10 document
            still 1 document remains so it returns true and hence hasNextPage exists */
          hasPreviousPage: page > 1,
          // 1 is the starting page if page is 2 it means it is less then page 1 so it returns true and hence hasPreviousPage exists
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalDocuments / doc_per_page), // 11/5=2.2 => 3, -5.9 => 5. It rounds a number UP to the nearest integer
        });
      })
      .catch((error) => next(new AppError(error, 404)));
  };
};
