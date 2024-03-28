const {
  index,
  create,
  update,
  destroy,
  reconnect,
} = require("../controllers/gate.controller");

const router = require("express").Router();

router
  .get("/", index)
  .post("/", create)
  .put("/:id", update)
  .delete("/:id", destroy)
  .post("/reconnect/:id", reconnect);

module.exports = router;
