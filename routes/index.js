const { login, doLogin, logout } = require("../controllers/auth.controller");
const { home, log } = require("../controllers/main.controller");
const { checkIn, index, show } = require("../controllers/ticket.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();

router.get("/login", login);
router.post("/login", doLogin);
router.get("/logout", logout);
router.post("/checkIn", checkIn);

router.use(authMiddleware);
router.get("/", home);
router.get("/log", log);
router.use("/gate", require("./gate.route"));
router.get("/tickets", index);
router.get("/tickets/:code", show);

module.exports = router;
