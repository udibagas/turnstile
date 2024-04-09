const { getLastLog } = require("../lib/log");

module.exports = {
  async log(req, res, next) {
    if (req.get("content-type") == "application/json") {
      try {
        const logs = await getLastLog("./daemon/turnstileapp.out.log", 50);
        res.json({ logs });
      } catch (error) {
        next(error);
      }
    } else {
      res.render("layout", { view: "log", route: "/log" });
    }
  },
};
