require("dotenv").config();
const fetchTicket = require("./lib/fetchTicket");
const [command] = process.argv.slice(2);

switch (command) {
  case "ticket:fetch":
    await fetchTicket();
    break;

  default:
    console.log("Invalid command");
    break;
}
