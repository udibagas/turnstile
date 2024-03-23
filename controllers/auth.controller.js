const { User } = require("../models");

module.exports = {
  async login(req, res) {
    res.render("layout", { view: "login" });
  },

  async doLogin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email, password } });
      if (!user) {
        res.redirect(`/login?message=Invalid email or password`);
      }
    } catch (error) {
      console.error(error);
      res.send(error.message);
    }
  },

  async logout(req, res) {
    req.session = null;
  },
};
