require("dotenv").config();
const { Socket } = require("net");

function reconnect(client, host) {
  client.removeAllListeners();
  client.destroy();

  setTimeout(() => {
    scan(host);
  }, 1000);
}

function scan(host) {
  const client = new Socket();

  client.connect(5000, host, () => {
    console.log(`${host} is connected`);
  });

  client.on("data", (data) => {
    data = data.toString().slice(1, -1);
    console.log(data);
    const number = "";

    try {
      const ticket = Ticket.findOne({ where: { number } });

      if (!ticket) {
        return console.log(`Tiket ${number} tidak ditemukan`);
      }

      if (ticket.status == false) {
        return console.log(`Tiket ${number} sudah tidak berlaku`);
      }

      console.log(`Tiket ${number} valid. Turnstile dibuka`);
      client.write(Buffer.from(`\xA6OUT1ON\xA9`));
      ticket.update({ status: false });
    } catch (error) {
      console.error(error.message);
    }
  });

  client.on("error", (error) => {
    console.error(error.message);
    reconnect(client, host);
  });

  client.on("close", () => {
    console.log(`${host} is disconnected`);
    reconnect(client, host);
  });
}

const gates = process.env.GATES.split(",");
gates.forEach((gate) => scan(gate));
