require("dotenv").config();
const { Ticket } = require("../models");
const fetch = require("cross-fetch");

const fetchTicket = async () => {
  const res = await fetch(`${process.env.API_URL}/ticket`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await res.json();
  const lastData = await Ticket.findOne({
    order: [["updated_at", "desc"]],
  });

  data.forEach(async (row) => {
    const { code, ...defaults } = row;
    delete defaults.id; // remove PK

    // insert new data only
    if (row.updated_at > lastData.updated_at) {
      const newTicket = await Ticket.findOrCreate({
        where: { code },
        defaults,
      });
      console.log(`New ticket: ${newTicket.code}`);
    }
  });
};

module.exports = fetchTicket;
