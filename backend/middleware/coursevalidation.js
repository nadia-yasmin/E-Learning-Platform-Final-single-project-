const { body } = require("express-validator");

const validator = {
  create: [
    body("title")
      .exists()
      .withMessage("Title must be provided")
      .isString()
      .withMessage("Title must be a string"),
    body("description")
      .exists()
      .withMessage("Description must be provided")
      .isString()
      .withMessage("Description must be a string"),
    body("video")
      .exists()
      .withMessage("Video file must be provided"),
    body("slides")
      .exists()
      .withMessage("Slides file must be provided"),
    body("assignment")
      .exists()
      .withMessage("Assignment image file must be provided"),
    body("assignmentext")
      .exists()
      .withMessage("Assignment text must be provided")
      .isString()
      .withMessage("Assignment text must be a string"),
  ],
};

module.exports = { validator };