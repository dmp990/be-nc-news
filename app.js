const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./controllers/topicsControllers");

const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./controllers/articlesControllers");

const { getUsers } = require("./controllers/usersControllers");

const {
  handleInvalidRoute,
  handleCustomErrors,
  unhandledErrors,
} = require("./error_handlers/errors");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.all("*", handleInvalidRoute);

app.use(handleCustomErrors);

app.use(unhandledErrors);

module.exports = app;
