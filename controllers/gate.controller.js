const { Gate } = require("../models");

module.exports = {
  async index(req, res) {
    try {
      const gates = await Gate.findAll({ order: [["name", "asc"]] });
      res.json(gates);
    } catch (error) {
      console.log(error);
      res.status(5000).json({ message: error.message });
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
      console.log(error);
      if (error.name == "SequelizeValidationError") {
        const errors = {};

        error.errors.forEach((e) => {
          if (errors[e.field] == undefined) {
            errors[e.field] = [];
          }

          errors[e.field].push(e.message);
        });

        res.render("layout", { view: "gate/_form", gate, error: errors });
      } else {
        res.status(5000).json({ message: error.message });
      }
    }
  },

  async edit(req, req) {
    try {
      const gate = await Gate.findByPk(req.params.id);
      if (!gate) throw new Error("Gate not found");
      res.render("layout", { view: "gate/_form", gate });
    } catch (error) {
      console.log(error);
      res.status(5000).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const gate = await Gate.findByPk(req.params.id);
      if (!gate) throw new Error("Gate not found");
      await gate.update(req.body);
      res.json({ message: "Gate telah diupdate", gate });
    } catch (error) {
      console.log(error);
      if (error.name == "SequelizeValidationError") {
        const errors = {};

        error.errors.forEach((e) => {
          if (errors[e.field] == undefined) {
            errors[e.field] = [];
          }

          errors[e.field].push(e.message);
        });

        res.render("layout", {
          view: "gate/_form",
          gate: Gate.build(req.body),
          error: errors,
        });
      } else {
        res.status(5000).json({ message: error.message });
      }
    }
  },

  async destroy(req, res) {
    try {
      const gate = await Gate.findByPk(req.params.id);
      if (!gate) throw new Error("Gate not found");
      await gate.destroy();
      res.json({ message: "Gate telah dihapus" });
    } catch (error) {
      console.log(error);
      res.status(5000).json({ message: error.message });
    }
  },
};
