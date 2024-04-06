const { login, doLogin, logout } = require("../controllers/auth.controller");
const { home, log, checkIn } = require("../controllers/main.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.get("/login", login);
router.post("/login", doLogin);
router.get("/logout", logout);
router.get("/in", checkIn);

router.use(authMiddleware);
router.get("/", home);
router.get("/log", log);
router.use("/gate", require("./gate.route"));

module.exports = router;
