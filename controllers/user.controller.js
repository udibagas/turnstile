const { User } = require("../models");

module.exports = {
  async update(req, res, next) {
    const { name, email, password } = req.body;

    try {
      const user = await User.findByPk(req.session.user.id);
      if (!user) throw new Error(`Invalid user`);
      await user.update({ name, email, password });
      res.json({ message: "Data telah disimpan" });
    } catch (error) {
      next(error);
    }
  },
};
