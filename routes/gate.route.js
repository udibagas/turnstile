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
  .get("/add", add)
  .post("/", create)
  .get("/edit/:id", edit)
  .put("/edit:/id", update)
  .get("/delete/:id", destroy);

module.exports = router;
