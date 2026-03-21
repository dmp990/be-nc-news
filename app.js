const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 2000, // Limit each IP to 2000 requests per `window`
  standardHeaders: "draft-7", // combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests, please try again later.",
});

app.set("trust proxy", 2);

app.use(limiter);
app.use(morgan("combined"));
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

app.get("/ip", (req, res) => {
  res.json({ ip: req.ip });
});

// ROOT

app.get("/", getRoot);

// ROUTER FN

app.use("/api", apiRouter);

// MIDDLEWARE FN TO HANDLE INVALID ROUTES

app.all("/*splat", handleInvalidRoute);

// ERROR HANDLING MIDDLEWARE

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(unhandledErrors);

module.exports = app;
