const { Op } = require("sequelize");
const { Gate, Ticket } = require("../models");

module.exports = {
  async index(req, res, next) {
    const { search, status: ticket_status, page = 1 } = req.query;
    const pageSize = 15;
    let totalPage = 1;

    const options = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    };

    if (search) {
      options.where = {
        code: {
          [Op.like]: `%${search}%`,
        },
      };
    }

    if (ticket_status) {
      options.where = { ticket_status };
    }

    try {
      const tickets = await Ticket.findAndCountAll(options);
      totalPage = Math.ceil(tickets.count / pageSize);
      res.render("layout", {
        view: "tickets",
        tickets,
        query: { ...req.query, page },
        totalPage,
      });
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

  async show(req, res, next) {
    const { code } = req.params;

    try {
      const ticket = await Ticket.findOne({ where: { code } });
      if (!ticket) throw new Error(`Invalid ticket id`);
      // TODO: generate QR
      res.json({ ticket });
    } catch (error) {
      next(error);
    }
  },

  async fetch(req, res, next) {
    try {
      await Ticket.fetch();
      res.redirect("/tickets");
    } catch (error) {
      next(error);
    }
  },
};
