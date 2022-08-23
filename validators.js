const { body, validationResult } = require('express-validator');

const validateMovie = (req, res, next) => {
  const { title, director, year, color, duration } = req.body;
    const errors = [];

  if (title == null) {
    errors.push({ field: "title", message: "This field is required"});
  }
  if (title.length >= 255) {
    errors.push({ field: "title", message: "This field is too long and must be 255 characters max"});
  }
  if (director == null) {
    errors.push({ field: "director", message: "This field is required"});
  }
  if (year == null) {
    errors.push({ field: "year", message: "This field is required"});
  }
  if (color == null) {
    errors.push({ field: "color", message: "This field is required"});
  }
  if (duration == null) {
    errors.push({ field: "duration", message: "This field is required"});
  } 
  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    next();
  }
}

const validateUser = [
  body("firstname").isLength({ max: 2 }).notEmpty(),
  body("lastname").isLength({ max: 255 }).notEmpty(),
  body("email").isEmail().isLength({ max: 255 }),
  body("city").isLength({ max: 255 }),
  body("language").isLength({ max: 255 }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = {
  validateMovie,
  validateUser,
};