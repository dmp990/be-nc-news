const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./controllers/topicsControllers");

const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/articlesControllers");

const { getUsers } = require("./controllers/usersControllers");

const { deleteCommentById } = require("./controllers/commentsControllers");

const {
  handleInvalidRoute,
  handleCustomErrors,
  unhandledErrors,
  handlePsqlErrors,
} = require("./error_handlers/errors");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.all("*", handleInvalidRoute);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(unhandledErrors);

module.exports = app;
