const endpoints = require("../endpoints.json");

exports.fetchEndpoints = () => {
  return Promise.resolve(endpoints);
};
