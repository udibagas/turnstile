var cookieSession = require("cookie-session");
const express = require("express");
const { Gate } = require("./models");
const { auth } = require("./middlewares/auth.middleware");
const { login } = require("./controllers/auth.controller");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["a6NJG5s22Xr1rQzZRAS5rycACVCo6WHsuqLPhBtRLd0Jp7ONsrldfeEn7D0oEXoD"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(require("./routes"));

app.listen(port, () => {
  console.log(`App running on port ${3000}`);
});

const scan = async () => {
  const gates = await Gate.findAll();
  gates.forEach((gate) => scan(gate));
};

scan();
