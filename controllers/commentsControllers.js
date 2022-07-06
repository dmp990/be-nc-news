const { removeCommentById } = require("../models/commentsModels");

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
