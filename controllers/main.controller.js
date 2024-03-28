const { getLastLog } = require("../lib/log");
const { Gate } = require("../models");

module.exports = {
  async home(req, res) {
    try {
      const gates = await Gate.findAll({ order: [["name", "asc"]] });
      res.render("layout", { view: "home", gates });
    } catch (error) {
      res.send(error.message);
      console.log(error);
    }
  },

  async log(req, res) {
    try {
      const logs = await getLastLog("./daemon/turnstileapp.out.log", 50);
      res.json({ logs });
    } catch (error) {
      res.send(error.message);
    }
  },
};
