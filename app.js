require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const { Gate, Ticket } = require("./models");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieMiddleware = require("./middlewares/cookie.middleware");
const app = express();
const port = 3000;

cron.schedule("*/30 * * * *", Ticket.fetch);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieMiddleware);

app.use((req, res, next) => {
  app.locals.user = req.session.user;
  next();
});

app.use(require("./routes"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`App running on port ${3000}`);
});

const scan = async () => {
  const gates = await Gate.findAll();
  gates.forEach((gate) => {
    try {
      gate.scan();
    } catch (error) {
      console.log(error.message);
    }
  });
};

scan();
