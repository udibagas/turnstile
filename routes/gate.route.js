const {
  index,
  add,
  create,
  edit,
  update,
  destroy,
} = require("../controllers/gate.controller");

const router = require("express").Router();

router
  .get("/", index)
  .post("/", create)
  .put("/:id", update)
  .delete("/:id", destroy);

module.exports = router;
