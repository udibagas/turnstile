const { create, update, destroy } = require("../controllers/gate.controller");
const router = require("express").Router();
router.post("/", create).put("/:id", update).delete("/:id", destroy);

module.exports = router;
