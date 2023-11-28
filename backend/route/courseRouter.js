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
const instructorController = require("../controller/instructorController");
const {
  isAuthorised,
  isAdmin,
  isLearner,
  isInstructor,
} = require("../middleware/authentictevalidation");
const { MulterError } = require("multer");
const {
  validator,
  userupdatevalidator,
} = require("../middleware/uservalidation");

//COURSE
//done
routes.post(
  "/addcourse",isAuthorised,isInstructor,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "intro", maxCount: 1 },
  ]),
  (req, res, next) => {
    courseController.addCourse(req, res, next);
  }
);
//done wihtout media

routes.put(
  "/updatecourse",isAuthorised,isInstructor,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "intro", maxCount: 1 },
  ]),
  (req, res, next) => {
    courseController.updateCourse(req, res, next);
  }
);
//done
routes.delete("/deletecourse",isAuthorised,isInstructor, courseController.deleteCourse);
//done
routes.post(
  "/addlesson",isAuthorised,isInstructor,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "slides", maxCount: 1 },
    { name: "assignment", maxCount: 1 },
  ]),
  (req, res, next) => {
    lessonController.addLesson(req, res, next);
  }
);
//not done

routes.put(
  "/updatelesson",isAuthorised,isInstructor,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "slides", maxCount: 1 },
    { name: "assignment", maxCount: 1 },
  ]),
  (req, res, next) => {
    lessonController.updateLesson(req, res, next);
  }
);
//not done
routes.delete("/deletelesson",isAuthorised,isInstructor,lessonController.deletelesson);
//done
routes.post("/createquiz",isAuthorised,isInstructor, lessonController.createQuiz);
//done
routes.post("/addquiz",isAuthorised,isInstructor, lessonController.addQuiz);
//done
routes.post(
  "/adduser",
  upload.single("file"),
  validator.create,
  validator.show,
  authController.signUp
);
//not done
routes.put(
  "/updateuser",isAuthorised,
  upload.single("file"),
  userupdatevalidator.create,
  userController.updateuser
);
//not done
routes.delete("/deleteuser", isAuthorised,userController.deleteuser);
//done
routes.post("/addtocart",isAuthorised ,isLearner,courseController.enrollCourse);
//done
routes.post("/login", authController.login);
//done
routes.post("/sendforgetpasswordemail", authController.sendForgotPasswordEmail);
//done
routes.post("/transaction",isAuthorised ,isLearner, courseController.createTransaction);
//not done
routes.post("/createcategory",isAuthorised,isAdmin,courseController.createCategory);
//done
routes.get("/getallcategories", courseController.getallcategories);
//done
routes.post("/createtype",isAuthorised,isAdmin, courseController.createType);
//done
routes.get("/getalltypes", courseController.getalltypes);
//done
routes.post("/addrate", isAuthorised,courseController.addRate);
//done
routes.put("/updateRate", isAuthorised,courseController.updateRate);
//done
routes.delete("/deleterate",isAuthorised, courseController.deleteRate);
//done
routes.get("/getcourses", courseController.getCourses);
//done
routes.post("/attemptquiz", isAuthorised,isLearner,lessonController.attemptQuiz);
//done
routes.post("/submitquiz",  isAuthorised,isLearner,lessonController.submitQuiz);
//done
routes.post("/addtowishlist",  isAuthorised,isLearner,courseController.addtoWishlist);
//done
routes.get("/showwishlist",isAuthorised, courseController.showWishlist);
//not done
routes.get("/showalladmins", isAuthorised, isAdmin,userController.showalladmins);
//not done
routes.get("/showallinstructors", isAuthorised, isAdmin,userController.showallinstructors);
//done
routes.get("/showalllearners", isAuthorised, isAdmin,userController.showalllearners);
//done
routes.post(
  "/submitassignment",
  upload.single("file"),
  lessonController.submitassignment
);
//done
routes.post("/evaluateassignment",isAuthorised,isInstructor ,lessonController.evaluateassignment);
//done
routes.post("/postdiscussion", isAuthorised,lessonController.postdiscussion);
//done
routes.get("/showdiscussion", isAuthorised, lessonController.showdiscussion);
//Done
routes.post("/addreview",isAuthorised,isLearner, courseController.addreview);
//not done
routes.put("/updatereview",isAuthorised,isLearner, courseController.updatereview);
//view profile
//done
routes.get("/getprofile", isAuthorised, userController.viewOwnProfile);
//done
routes.post(
  "/getinstructorscourse",
  isAuthorised,
  isInstructor,
  courseController.getinstructorscourse
);

//updatereview
//done
routes.get("/showlessonbyweek", isAuthorised,lessonController.showlessonbyweek);
//done
routes.get("/showlessonbyid", isAuthorised,lessonController.showlessonid);
//done
routes.get("/getcoursebyid", isAuthorised, courseController.showcoursebyid);
//done
routes.get("/showpendingcourse", isAuthorised, isAdmin,adminController.showpendingcourse);
//done
routes.put("/approverejectcourse", isAuthorised, isAdmin,adminController.approverejectcourse);
//done
routes.get("/viewunapprovedcourse", isAuthorised, isAdmin,adminController.viewunapprovedcourse);
//done
routes.put("/approvecoursecreation", isAuthorised, isAdmin,adminController.approvecoursecreation);
//NOT done
routes.delete("/removecart", isAuthorised,isLearner,learnerController.removecart);
//done
routes.delete("/removefromcart", isAuthorised,isLearner,learnerController.removefromcart);
// viewownprofile
//done
routes.get("/showlessonbycourse",isAuthorised, lessonController.showLessonByCourse);
//done
routes.get("/showquizbylesson", isAuthorised,lessonController.showquizbylesson);
//done
routes.get("/getbycategoryid", courseController.getbycategoryid);
//done
routes.get("/showcart", isAuthorised,courseController.showCart);
//done
routes.post("/viewallsubscription", isAuthorised, courseController.viewAllSubscriptions);
//done
routes.put("/removefromcart", isAuthorised,isLearner,courseController.removeFromCart);
//done
routes.put(
  "/cancelsubscriptionrequest",isAuthorised,courseController.cancelSubscriptionRequest
);
//done
routes.get("/showsubscribedcourse", isAuthorised,courseController.showsubscribedcourses);
//done
routes.get("/showmystudents",isAuthorised,isInstructor,instructorController.showmystudents);
//Done
routes.post(
  "/viewmystudentsassignments",isAuthorised,isInstructor,
  instructorController.viewmystudentsassignments
);
//done
routes.get("/showprogress",isAuthorised, learnerController.showprogress);
//done
routes.get("/showassignmentscore", isAuthorised,learnerController.showassignmentscore);

//Done
routes.post("/resetpassword", authController.resetPassword);
//URL NOT FOUND
routes.use(urlnotfound.notFound);
module.exports = routes;
