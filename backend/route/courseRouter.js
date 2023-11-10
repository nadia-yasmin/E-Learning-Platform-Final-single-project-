const express = require("express");
const routes = express();
const upload = require("../config/file");
const multer = require("multer");
const urlnotfound = require("../constants/urlnotfound");
const courseController = require("../controller/courseController");
const lessonController = require("../controller/lessonController");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const { MulterError } = require("multer");

//COURSE
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

routes.post(
  "/addlesson",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "slides", maxCount: 1 },
    { name: "assignment", maxCount: 1 },
  ]),
  (req, res, next) => {
    lessonController.addLesson(req, res, next);
  }
);
routes.post("/createquiz", lessonController.createQuiz);
routes.post("/addquiz", lessonController.addQuiz);
routes.post("/adduser", upload.single("file"), authController.signUp);
routes.post("/addtocart", courseController.enrollCourse);
routes.post("/login", authController.login);
routes.post("/transaction", courseController.createTransaction);
routes.post("/createcategory", courseController.createCategory);
routes.post("/createtype", courseController.createType);
routes.post("/addrate", courseController.addRate);
routes.get("/getcourses", courseController.getCourses);
routes.post("/attemptquiz", lessonController.attemptQuiz);
routes.post("/submitquiz", lessonController.submitQuiz);
routes.post("/addtowishlist", courseController.addtoWishlist);
routes.get("/showwishlist", courseController.showWishlist);
routes.get("/showalladmins", userController.showalladmins);
routes.get("/showallinstructors", userController.showallinstructors);
routes.get("/showalllearners", userController.showalllearners);
routes.post(
  "/submitassignment",
  upload.single("file"),
  lessonController.submitassignment
);
//evaluateassignment
routes.post("/evaluateassignment", lessonController.evaluateassignment);
//URL NOT FOUND
routes.use(urlnotfound.notFound);
module.exports = routes;
