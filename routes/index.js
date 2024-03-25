const { login, doLogin, logout } = require("../controllers/auth.controller");
const { home } = require("../controllers/main.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.get("/login", login);
router.post("/login", doLogin);
router.get("/logout", logout);

router.use(authMiddleware);
router.get("/", home);
router.use("/gate", require("./gate.route"));

module.exports = router;
