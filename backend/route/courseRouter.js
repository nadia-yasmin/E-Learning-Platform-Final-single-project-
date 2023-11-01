const express = require("express");
const routes = express();
const upload = require("../config/file");
const multer = require("multer");
const urlnotfound = require("../constants/urlnotfound");
const courseController = require("../controller/courseController");
const { MulterError } = require("multer");

//COURSE
routes.post("/addbucket", upload.single("file"), courseController.createBucket);
routes.post(
  "/addcourse",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "intro", maxCount: 1 },
  ]),
  (req, res, next) => {
    courseController.addCourse(req, res, next);
  }
);

//URL NOT FOUND
routes.use(urlnotfound.notFound);
module.exports = routes;
