const { User } = require("../models");

module.exports = {
  async login(req, res) {
    const { message } = req.query;
    res.render("login", { message });
  },

  async doLogin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("Invalid email");
      }

      if (!user.verify(password)) {
        throw new Error("Invalid password");
      }

      req.session.user = user.toJSON();
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.redirect(`/login?message=${error.message}`);
    }
  },

  async logout(req, res) {
    req.session = null;
    res.redirect("/login");
  },
};
