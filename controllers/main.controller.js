const { getLastLog } = require("../lib/log");
const { Gate, Ticket } = require("../models");

module.exports = {
  async home(req, res, next) {
    try {
      const gates = await Gate.findAll({ order: [["name", "asc"]] });
      res.render("layout", { view: "home", gates });
    } catch (error) {
      next(error);
    }
  },

  async log(req, res, next) {
    try {
      const logs = await getLastLog("./daemon/turnstileapp.out.log", 50);
      res.json({ logs });
    } catch (error) {
      next(error);
    }
  },

  async checkIn(req, res, next) {
    const { code } = req.body;

    try {
      const gate = await Gate.findOne({ where: { host: req.ip.slice(7) } });
      if (!gate) throw new Error("Invalid gate");
      const status = await Ticket.checkIn(code, gate);
      if (!status) throw new Error(`Something bad happened`);
      res.json({ message: "Silakan masuk" });
    } catch (error) {
      next(error);
    }
  },
};
