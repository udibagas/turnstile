const { login, doLogin, logout } = require("../controllers/auth.controller");
const { home } = require("../controllers/main.controller");

const router = require("express").Router();

router.get("/login", login);
router.post("/login", doLogin);
router.post("/logout", logout);

router.use(auth);
router.get("/", home);
router.get("/gate", require("./gate.route"));

module.exports = router;
