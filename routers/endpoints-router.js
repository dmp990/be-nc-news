const { getEndpoints } = require("../controllers/basicControllers");

const endpointsRouter = require("express").Router();

endpointsRouter.get('', getEndpoints)

module.exports = endpointsRouter;
