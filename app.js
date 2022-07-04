const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topicsControllers");

const {handleInvalidRoute} = require("./error_handlers/errors")

app.get("/api/topics", getTopics);

app.use("*", handleInvalidRoute);

module.exports = app;
