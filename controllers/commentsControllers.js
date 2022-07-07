const {
  removeCommentById,
  updateCommentById,
} = require("../models/commentsModels");

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentById = (req, res, next) => {
  updateCommentById(req.params, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
