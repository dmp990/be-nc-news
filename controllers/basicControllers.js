const { fetchEndpoints } = require("../models/basicModels");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getRoot = (req, res, next) => {
  res.status(200).send({
    message:
      "Welcome! Please visit /api to get a list of all available endpoints",
  });
};
