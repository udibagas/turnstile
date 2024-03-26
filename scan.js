const { Gate } = require("./models");

const scan = async () => {
  const gates = await Gate.findAll();
  gates.forEach((gate) => scan(gate));
};

scan();
