const errorHandler = (err, next) => {
  if (err) console.log(err.message.red.inverse);
  else {
    next();
  }
};

const notFound = (req, res) => {
  console.log(`Not Found ======> ${req.originalUrl.blue}`);
  res.status(404).send({
    data: 'Server Error',
    code: 404,
  });
};

module.exports = { errorHandler, notFound };
