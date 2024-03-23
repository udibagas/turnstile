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

  async add(req, res) {
    const gate = new Gate();
    res.render("layout", { view: "gate/_form", gate });
  },

  async create(req, res) {
    const gate = Gate.build(req.body);

    try {
      await gate.save();
      res.status(201).json(gate);
    } catch (error) {
      next(error);
    }
  },

  async edit(req, req) {
    try {
      const gate = await Gate.findByPk(req.params.id);
      if (!gate) throw new Error("Gate not found");
      res.render("layout", { view: "gate/_form", gate });
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
};
