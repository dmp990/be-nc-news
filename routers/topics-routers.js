const { getTopics, postTopic } = require("../controllers/topicsControllers");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);

topicsRouter.post("/", postTopic);

module.exports = topicsRouter;
