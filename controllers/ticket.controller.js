const { Op } = require("sequelize");
const { Gate, Ticket } = require("../models");

module.exports = {
  async index(req, res, next) {
    const { search, page } = req.query;
    const options = {};

    if (search) {
      options.where = {
        code: {
          [Op.like]: `%${search}%`,
        },
      };
    }

    if (page) {
      // TODO: pagination
    }

    try {
      const tickets = await Ticket.findAll(options);
      res.render("layout", { view: "tickets", tickets });
    } catch (error) {
      next(error);
    }
  },

  async checkIn(req, res, next) {
    const { code } = req.body;

    try {
      const gate = await Gate.findOne({ where: { host: req.ip.slice(7) } });
      if (!gate) throw new Error("Invalid gate");
      await Ticket.checkIn(code, gate);
      res.json({ message: "Silakan masuk" });
    } catch (error) {
      next(error);
    }
  },
};
