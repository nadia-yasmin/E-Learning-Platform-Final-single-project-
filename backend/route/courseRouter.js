const express = require("express");
const routes = express();
const upload = require("../config/file");
const multer = require("multer");
const urlnotfound = require("../constants/urlnotfound");
const courseController = require("../controller/courseController");
const lessonController = require("../controller/lessonController");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const adminController = require("../controller/adminController");
const learnerController = require("../controller/learnerController");
const {isAuthorised,isAdmin,isLearner,isInstructor} = require("../middleware/authentictevalidation")
const { MulterError } = require("multer");
const {
  validator,
  userupdatevalidator,
} = require("../middleware/uservalidation");

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

routes.put(
  "/updatecourse",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "intro", maxCount: 1 },
  ]),
  (req, res, next) => {
    courseController.updateCourse(req, res, next);
  }
);

routes.delete("/deletecourse", courseController.deleteCourse);

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

routes.put(
  "/updatelesson",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "slides", maxCount: 1 },
    { name: "assignment", maxCount: 1 },
  ]),
  (req, res, next) => {
    lessonController.updateLesson(req, res, next);
  }
);
routes.delete("/deletelesson", lessonController.deletelesson);
routes.post("/createquiz", lessonController.createQuiz);
routes.post("/addquiz", lessonController.addQuiz);
routes.post(
  "/adduser",
  upload.single("file"),
  validator.create,
  validator.show,
  authController.signUp
);
routes.put(
  "/updateuser",
  upload.single("file"),
  userupdatevalidator.create,
  userController.updateuser
);
routes.delete("/deleteuser", userController.deleteuser);
routes.post("/addtocart", courseController.enrollCourse);
routes.post("/login", authController.login);
routes.post("/transaction", courseController.createTransaction);
routes.post("/createcategory", courseController.createCategory);
routes.get("/getallcategories", courseController.getallcategories);
routes.post("/createtype", courseController.createType)
routes.get("/getalltypes", courseController.getalltypes)
routes.post("/addrate", courseController.addRate);
routes.put("/updateRate", courseController.updateRate);
routes.delete("/deleterate", courseController.deleteRate);

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
routes.post("/evaluateassignment", lessonController.evaluateassignment);
routes.post("/postdiscussion", lessonController.postdiscussion);
routes.post("/addreview", courseController.addreview);
routes.put("/updatereview", courseController.updatereview);
//view profile
routes.get("/getprofile", isAuthorised,userController.viewOwnProfile);
routes.post("/getinstructorscourse", isAuthorised,isInstructor, courseController.getinstructorscourse);

//updatereview
routes.get("/showlessonbyweek", lessonController.showlessonbyweek);
routes.get("/showlessonbyid", lessonController.showlessonid);
routes.get("/getcoursebyid", courseController.showcoursebyid);
routes.get("/showpendingcourse", adminController.showpendingcourse);
routes.put("/approverejectcourse", adminController.approverejectcourse);
routes.put("/approvecoursecreation", adminController.approvecoursecreation);
routes.delete("/removecart", learnerController.removecart);
routes.delete("/removefromcart", learnerController.removefromcart);
// viewownprofile

//URL NOT FOUND
routes.use(urlnotfound.notFound);
module.exports = routes;
