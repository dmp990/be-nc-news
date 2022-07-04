const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topicsControllers");

const { getArticleById } = require("./controllers/articlesControllers");

const { getUsers } = require("./controllers/usersControllers");

const {
  handleInvalidRoute,
  handleCustomErrors,
  unhandledErrors,
} = require("./error_handlers/errors");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

app.all("*", handleInvalidRoute);

app.use(handleCustomErrors);

app.use(unhandledErrors);

module.exports = app;
