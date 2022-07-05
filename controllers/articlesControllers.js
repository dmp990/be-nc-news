const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
} = require("../models/articlesModels");

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.params)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
