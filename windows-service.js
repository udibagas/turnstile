const { Service } = require("node-windows");
const svc = new Service({
  name: "Turnstile App",
  description: "Turnstile app as a Windows service.",
  script: "C:\\apps\\turnstile\\app.js",
});

svc.on("install", () => {
  svc.start();
});

svc.install();
