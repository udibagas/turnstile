const fs = require("fs");
const readline = require("readline");

function getLastLog(filePath, linesCount) {
  return new Promise((resolve, reject) => {
    const lines = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      lines.push(line);
      if (lines.length > linesCount) {
        lines.shift(); // Remove the first line if there are more than linesCount lines
      }
    });

    rl.on("close", () => {
      resolve(lines);
    });

    rl.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = { getLastLog };
