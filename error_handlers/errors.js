exports.handleInvalidRoute = (req, res) => {
  res.status(404).send({ msg: "Invalid route" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.unhandledErrors = (err, req, res) => {
  res.status(500).send({ msg: "I messed up" });
};
