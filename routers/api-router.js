const apiRouter = require("express").Router();

const endpointsRouter = require("./endpoints-router");
const topicsRouter = require("./topics-routers");
const articleRouter = require("./articles-routers");
const commentsRouter = require("./comments-routers");
const usersRouter = require("./users-routers");

apiRouter.route("").get(endpointsRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
