const chalk = require("chalk");

function colorStatus(status) {
  if (status >= 500) return chalk.red(status);     // Server error
  if (status >= 400) return chalk.yellow(status);  // Client error
  if (status >= 300) return chalk.cyan(status);    // Redirect
  if (status >= 200) return chalk.green(status);   // Success
  return chalk.white(status);
}

// yeah I used gpt for all this lol
// function colorMethod(method) {
//   switch (method) {
//     case "GET": return chalk.blue(method);
//     case "POST": return chalk.magenta(method);
//     case "PUT": return chalk.yellow(method);
//     case "DELETE": return chalk.red(method);
//     default: return chalk.white(method);
//   }
// }

function ipLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const status = colorStatus(res.statusCode);

    const logMsg = `${req.method} ${req.originalUrl} --- ${req.ip} ${status} ${duration}ms ~`;

    console.log(logMsg);
  });

  next();
}

module.exports = ipLogger;