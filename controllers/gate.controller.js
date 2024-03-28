const { Gate } = require("../models");

module.exports = {
  async index(req, res) {
    try {
      const gates = await Gate.findAll({ order: [["name", "asc"]] });
      res.json(gates);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    const gate = Gate.build(req.body);

    try {
      await gate.save();
      res.status(201).json(gate);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res) {
    try {
      const gate = await Gate.findByPk(req.params.id);
      if (!gate) throw new Error("Gate not found");
      await gate.update(req.body);
      res.json({ message: "Gate telah diupdate", gate });
    } catch (error) {
      next(error);
    }
  },

  async destroy(req, res) {
    try {
      const gate = await Gate.findByPk(req.params.id);
      if (!gate) throw new Error("Gate not found");
      await gate.destroy();
      res.json({ message: "Gate telah dihapus" });
    } catch (error) {
      next(error);
    }
  },

  async reconnect(req, res) {
    try {
      const gate = await Gate.findByPk(req.params.id);
      if (!gate) throw new Error("Gate not found");
      gate.scan();
      res.json({ message: "Gate dihubungkan kembali" });
    } catch (error) {
      next(error);
    }
  },
};
