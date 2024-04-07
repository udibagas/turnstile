module.exports = (error, req, res, next) => {
  console.log(error);
  if (error.name == "SequelizeValidationError") {
    const errors = {};

    error.errors.forEach((e) => {
      if (errors[e.path] == undefined) {
        errors[e.path] = [];
      }

      errors[e.path].push(e.message);
    });

    res.status(400).json({ message: "Validation error", errors });
  } else {
    res.status(500).json({ message: error.message });
  }
};
