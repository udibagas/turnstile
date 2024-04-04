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
  const lastData = await Ticket.findOne({
    order: [["updated_at", "desc"]],
  });

  data.forEach(async (row) => {
    const { code, ...defaults } = row;
    defaults.date_generate = new Date();
    delete defaults.id;
    delete defaults.deleted_at;

    // insert new data only
    if (!lastData || (lastData && row.updated_at > lastData.updated_at)) {
      await Ticket.findOrCreate({
        where: { code },
        defaults,
      });
      console.log(`New ticket: ${code}`);
    }
  });
};

module.exports = fetchTicket;
