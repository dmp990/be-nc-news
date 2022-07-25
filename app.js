const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

const { getRoot } = require("./controllers/basicControllers");

const {
  handleInvalidRoute,
  handleCustomErrors,
  unhandledErrors,
  handlePsqlErrors,
} = require("./error_handlers/errors");

const apiRouter = require("./routers/api-router");

// ROOT

app.get("/", getRoot);

// ROUTER FN

app.use("/api", apiRouter);

// MIDDLEWARE FN TO HANDLE INVALID ROUTES

app.all("*", handleInvalidRoute);

// ERROR HANDLING MIDDLEWARE

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(unhandledErrors);

module.exports = app;
