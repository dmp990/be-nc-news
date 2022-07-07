const {
  getArticles,
  getArticleById,
  patchArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/articlesControllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles);

articleRouter.route("/:article_id").get(getArticleById);

articleRouter.route("/:article_id").patch(patchArticleById);

articleRouter.route("/:article_id/comments").get(getCommentsByArticleId);

articleRouter.route("/:article_id/comments").post(postCommentByArticleId);

module.exports = articleRouter;