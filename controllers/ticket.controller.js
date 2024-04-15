const { Gate, Ticket } = require("../models");
const QRCode = require("qrcode");

module.exports = {
  async index(req, res, next) {
    const { search, status: ticket_status, page = 1 } = req.query;

    try {
      const data = await Ticket.paginate(page, 15, { search, ticket_status });
      if (req.get("content-type") == "application/json") {
        return res.json(data);
      }

      res.render("layout", {
        view: "tickets",
        data,
        query: { ...req.query, page },
        route: "/tickets",
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

      if (!gate.status) {
        await gate.update({ status: true });
      }

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
      const qr = await QRCode.toDataURL(ticket.code, { width: 200 });
      res.json({ ticket, qr });
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
