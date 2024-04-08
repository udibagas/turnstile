const { getLastLog } = require("../lib/log");
const { Gate } = require("../models");

module.exports = {
  async home(req, res, next) {
    try {
      const gates = await Gate.findAll({ order: [["name", "asc"]] });
      res.render("layout", { view: "home", gates, route: "/" });
    } catch (error) {
      next(error);
    }
  },

  async getLog(req, res, next) {
    try {
      const logs = await getLastLog("./daemon/turnstileapp.out.log", 50);
      res.json({ logs });
    } catch (error) {
      next(error);
    }
  },

  async log(req, res) {
    res.render("layout", { view: "log", route: "/log" });
  },
};
