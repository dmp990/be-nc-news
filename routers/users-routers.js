const { getUsers } = require("../controllers/usersControllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
