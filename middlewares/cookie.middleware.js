var cookieSession = require("cookie-session");

module.exports = cookieSession({
  name: "session",
  keys: ["a6NJG5s22Xr1rQzZRAS5rycACVCo6WHsuqLPhBtRLd0Jp7ONsrldfeEn7D0oEXoD"],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
