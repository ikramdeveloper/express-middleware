const { logEvent } = require("./logEvents");

const errorHandler = (err, req, resp, next) => {
  logEvent(`${err.name} ${err.message}`, "errLog.txt");
  console.error(err.stack);
  resp.status(500).send(err.message);
};

module.exports = errorHandler;
