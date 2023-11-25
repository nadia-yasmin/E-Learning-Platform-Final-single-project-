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
  "/addcourse",
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
  "/updatecourse",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "intro", maxCount: 1 },
  ]),
  (req, res, next) => {
    courseController.updateCourse(req, res, next);
  }
);
//done//done
routes.delete("/deletecourse", courseController.deleteCourse);
//done//done
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
//not done

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
//not done
//not done
routes.delete("/deletelesson", lessonController.deletelesson);
//done
//done
routes.post("/createquiz", lessonController.createQuiz);
//done
//done
routes.post("/addquiz", lessonController.addQuiz);
//done
//done
routes.post(
  "/adduser",
  upload.single("file"),
  validator.create,
  validator.show,
  authController.signUp
);
//not done
//not done
routes.put(
  "/updateuser",
  upload.single("file"),
  userupdatevalidator.create,
  userController.updateuser
);
//not done
//not done
routes.delete("/deleteuser", userController.deleteuser);
//done
//done
routes.post("/addtocart", courseController.enrollCourse);
//done
//done
routes.post("/login", authController.login);
//not done
//not done
routes.post("/transaction", courseController.createTransaction);
//not done
//not done
routes.post("/createcategory", courseController.createCategory);
//done
//done
routes.get("/getallcategories", courseController.getallcategories);
//not done
//done
routes.post("/createtype", courseController.createType);
//done
//done
routes.get("/getalltypes", courseController.getalltypes);
//not done
//not done
routes.post("/addrate", courseController.addRate);
//not done
//not done
routes.put("/updateRate", courseController.updateRate);
//done
routes.delete("/deleterate", courseController.deleteRate);
//done//done
routes.get("/getcourses", courseController.getCourses);
//done
//done
routes.post("/attemptquiz", lessonController.attemptQuiz);
//done
//done
routes.post("/submitquiz", lessonController.submitQuiz);
//not done
//not done
routes.post("/addtowishlist", courseController.addtoWishlist);
//not done
//not done
routes.get("/showwishlist", courseController.showWishlist);
//not done
//not done
routes.get("/showalladmins", userController.showalladmins);
//not done
//not done
routes.get("/showallinstructors", userController.showallinstructors);
//not done
//not done
routes.get("/showalllearners", userController.showalllearners);
//not done
//not done
routes.post(
  "/submitassignment",
  upload.single("file"),
  lessonController.submitassignment
);
//not done
//not done
routes.post("/evaluateassignment", lessonController.evaluateassignment);
//not done
//not done
routes.post("/postdiscussion", lessonController.postdiscussion);
//not done
//not done
routes.post("/addreview", courseController.addreview);
//not done
//not done
routes.put("/updatereview", courseController.updatereview);
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
routes.get("/showlessonbyweek", lessonController.showlessonbyweek);
//done
//done
routes.get("/showlessonbyid", lessonController.showlessonid);
//done
//done
routes.get("/getcoursebyid", courseController.showcoursebyid);
//not done
//not done
routes.get("/showpendingcourse", adminController.showpendingcourse);
//not done
routes.put("/approverejectcourse", adminController.approverejectcourse);
//not done
routes.put("/approvecoursecreation", adminController.approvecoursecreation);
routes.delete("/removecart", learnerController.removecart);
//done
routes.delete("/removefromcart", learnerController.removefromcart);
// viewownprofile
//done
//done
routes.get("/showlessonbycourse", lessonController.showLessonByCourse);
//done
routes.get("/showquizbylesson", lessonController.showquizbylesson);
//done
routes.get("/getbycategoryid", courseController.getbycategoryid);
//done
//done
routes.get("/showcart", courseController.showCart);
//done
routes.post("/viewallsubscription", courseController.viewAllSubscriptions);
//done
//done
routes.put("/removefromcart", courseController.removeFromCart);
//done
routes.put(
  "/cancelsubscriptionrequest",
  courseController.cancelSubscriptionRequest
);
//done
routes.get("/showsubscribedcourse", courseController.showsubscribedcourses);
//URL NOT FOUND
routes.use(urlnotfound.notFound);
module.exports = routes;
