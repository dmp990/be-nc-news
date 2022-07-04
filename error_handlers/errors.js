exports.handleInvalidRoute = (req, res) => {
  res.status(404).send({ msg: "Invalid route" });
};
