const { deleteCommentById, patchCommentById } = require("../controllers/commentsControllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentById);

commentsRouter.route("/:comment_id").patch(patchCommentById);

module.exports = commentsRouter;
