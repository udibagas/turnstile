const { getLastLog } = require("../lib/log");

module.exports = {
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
