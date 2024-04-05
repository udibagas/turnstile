require("dotenv").config();
const { Op } = require("sequelize");
const { Ticket } = require("./models");
const fetchTicket = require("./lib/fetchTicket");
const [command, ...params] = process.argv.slice(2);

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

  case "ticket:list":
    const options = {};

    if (params.length) {
      const ticket_status = params[0];
      options.where = { ticket_status };
    }

    Ticket.findAll(options)
      .then((tickets) => {
        tickets = tickets
          .map((el) => el.toJSON())
          .map((el) => {
            return {
              Code: el.code,
              Status: el.ticket_status,
              "Date Used": el.date_used,
            };
          });
        console.table(tickets);
      })
      .catch((err) => console.log(err));
    break;

  default:
    console.log("Invalid command");
    break;
}
