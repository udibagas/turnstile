const { login, doLogin, logout } = require("../controllers/auth.controller");
const { home } = require("../controllers/gate.controller");
const { log, getLog } = require("../controllers/main.controller");
const {
  checkIn,
  index,
  show,
  fetch,
} = require("../controllers/ticket.controller");
const { update } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();

router.get("/login", login);
router.post("/login", doLogin);
router.get("/logout", logout);
router.post("/checkIn", checkIn);

router.use(authMiddleware);
router.get("/", home);
router.get("/log", log);
router.get("/getLog", getLog);
router.use("/gate", require("./gate.route"));

router.get("/tickets", index);
router.get("/tickets/fetch", fetch);
router.get("/tickets/:code", show);
router.put("/user", update);

module.exports = router;
