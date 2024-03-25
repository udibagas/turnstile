module.exports = (error, req, res, next) => {
  console.error(error);
  if (error.name == "SequelizeValidationError") {
    const errors = {};

    error.errors.forEach((e) => {
      if (errors[e.field] == undefined) {
        errors[e.field] = [];
      }

      errors[e.field].push(e.message);
    });

    res.status(400).json({ message: "Validation error", errors });
  } else {
    res.status(500).json({ message: error.message });
  }
};
