const http = require("http");
const { Ticket } = require("../models");

const fetchTicket = () => {
  http.get(process.env.API_URL, (res) => {
    const { statusCode } = res;

    if (statusCode !== 200) {
      return console.log(`Failed to fetch tickets`);
    }

    let rawData = "";
    res.on("data", (chunk) => {
      rawData += chunk;
    });

    res.on("end", async () => {
      try {
        const parsedData = JSON.parse(rawData); // asumsi langsung [{...}, {...}]
        const lastData = await Ticket.findOne({
          order: [["updated_at", "desc"]],
        });

        parsedData.forEach(async (row) => {
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
      } catch (error) {
        console.log(`Failed to parse data ${error.message}`);
      }
    });
  });
};

module.exports = fetchTicket;
