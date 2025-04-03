const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

const errorResponse = (res, message = 'Error occurred', statusCode = 500) => {
  res.status(statusCode).json({
    status: 'error',
    message
  });
};

const paginateResponse = (res, data, page, limit, total) => {
  res.status(200).json({
    status: 'success',
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginateResponse
}; 