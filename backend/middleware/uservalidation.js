const { body, query } = require("express-validator");

const validator = {
  create: [
    body("email")
      .exists()
      .withMessage("Email must be provided")
      .isString()
      .withMessage("Email must be a string")
      .isEmail()
      .withMessage("Invalid email format"),
    body("name")
      .exists()
      .withMessage("Name must be provided")
      .isString()
      .withMessage("Name must be a string"),
    body("password")
      .exists()
      .withMessage("Password must be provided")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .withMessage(
        "Password must contain at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character"
      ),
  ],
  show: [
    query("role")
      .exists()
      .withMessage("Role must be provided in the query")
      .isString()
      .withMessage("Role must be a string"),
  ],
};
const userupdatevalidator = {
  create: [
    body("email")
      .optional()
      .isString()
      .withMessage("Email must be a string")
      .isEmail()
      .withMessage("Invalid email format"),
    body("name").optional().isString().withMessage("Name must be a string"),
    body("password")
      .optional()
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
      .withMessage(
        "Password must contain at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character"
      ),
  ],
};

module.exports = { validator, userupdatevalidator };
