require("dotenv").config();
const { Op } = require("sequelize");
const { Ticket } = require("./models");
const fetchTicket = require("./lib/fetchTicket");
const [command] = process.argv.slice(2);

switch (command) {
  case "ticket:fetch":
    fetchTicket();
    break;

  case "ticket:prune":
    Ticket.destroy({
      where: {
        ticket_status: {
          [Op.ne]: "ready",
        },
      },
    })
      .then((deletedRows) => {
        console.log(`Deleted ${deletedRows} rows`);
      })
      .catch((err) => console.log(err));
    break;

  default:
    console.log("Invalid command");
    break;
}
