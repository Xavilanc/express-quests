const { body, validationResult, check } = require('express-validator');
const db = require("./database");

/*const validateMovie = (req, res, next) => {
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
}*/

//Validation POST et PUT pour movies
const validateMovie = [
  body("title").isLength({ max: 255 }).notEmpty().isString(),
  body("director").isLength({ max: 255 }).notEmpty().isString(),
  body("year").isLength({ max: 255 }).notEmpty().isString(),
  body("color").isLength({ max: 255 }).notEmpty().isString(),
  body("duration").isLength({ max: 255 }).isInt(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

// Validation POST user (avec vérification email unique)
const validateUser = [
  body("firstname").isLength({ max: 255 }).isString().notEmpty(),
  body("lastname").isLength({ max: 255 }).isString().notEmpty(),
  body("city").isLength({ max: 255 }).isString(),
  body("language").isLength({ max: 255 }).isString(),
  check("email").trim().normalizeEmail().isEmail().withMessage("Invalid email").isLength({ max: 255 }).custom(async email => {
    const value = await isEmailInUse(email);
    if (value) {
        throw new Error('Email is already exists!!!');
    }
})
.withMessage('Email is already exists!!!'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

// validation PUT user
const validateUserId = [
  body("firstname").isLength({ max: 255 }).isString().notEmpty(),
  body("lastname").isLength({ max: 255 }).isString().notEmpty(),
  body("city").isLength({ max: 255 }).isString(),
  body("language").isLength({ max: 255 }).isString(),
  body("email").isLength({ max: 255 }).isEmail(),
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
  validateUserId,
};