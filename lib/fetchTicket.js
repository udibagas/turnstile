const { Ticket } = require("../models");
const fetch = require("cross-fetch");

const fetchTicket = async () => {
  console.log(`Fetching tickets...`);
  const res = await fetch(`${process.env.API_URL}/ticket`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await res.json();
  console.log(`Got ${data.length} tickets`);

  const existingReadyTickets = await Ticket.findAll({
    where: { ticket_status: "ready" },
  });

  const mappedData = data.map((el) => {
    el.date_generate = new Date();
    delete el.id;
    delete el.deleted_at;
    return el;
  });

  if (existingReadyTickets.length == 0) {
    await Ticket.bulkCreate(mappedData);
  } else {
    const filteredData = mappedData.filter((el) => {
      return !existingReadyTickets.map((t) => t.code).includes(el.code);
    });

    if (filteredData.length > 0) {
      console.log(`Got ${filteredData.length} new tickets`);
      await Ticket.bulkCreate(mappedData);
    }
  }
};

module.exports = fetchTicket;
