import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DenseAppBar from "./Components/navbar/navbar";
import Footer from "./Components/footer/footer";
import Login from "./Components/form/loginform";
import Signupoptions from "./Components/form/signupoptions";
import Signup from "./Components/form/signup";
import Getallcourse from "./Components/course/getcourse/getallcourse";
import Viewcourse from "./Components/course/getcourse/getsinglecourse";
import Viewlesson from "./Components/lesson/getlesson/getlessonbyid";
import Showdashboard from "./Components/common/dashboard/showdashboard";
import Showprofile from "./Components/user/profile/showprofile";
import Getinstructorscourse from "./Components/course/getcourse/getinstructorscourse";
import Addcourse from "./Components/course/postcourse/postcourse";
import DebounceDemo from "./Components/course/getcourse/searchcourse";
import Addlesson from "./Components/lesson/postlesson/addlesson";
import Getinstructorslesson from "./Components/lesson/getlesson/getinstructorlessons";
import "./App.css";
import Updatecourse from "./Components/course/updatecourse/updatecourse";
import Createquiz from "./Components/quiz/postquiz/createquiz";
import Showquizadmin from "./Components/quiz/getquiz/showquizadmin";
import Addquiz from "./Components/quiz/postquiz/addquiz";
import Getallcoursebycategory from "./Components/course/getcourse/getcoursebycategory";
import Viewcart from "./Components/cart/Viewcart";
import Getsubscribedcourse from "./Components/course/getcourse/getsubscribedcourse";
import Viewwishlist from "./Components/cart/Viewwishlist";
import Viewalllearners from "./Components/user/listofusers/showalllearners";
import Approvecancelsubscription from "./Components/Approve/subscriptionapproval";
import Viewunapprovedcourse from "./Components/Approve/viewunapprovedcourse";
import Viewmylearners from "./Components/Instructor/viewmylearners";
import Viewmystudentsassignments from "./Components/Instructor/viewmystudentsassignment";
import Resetpassword from "./Components/form/resetpassword";
import Forgotpassword from "./Components/form/submitforgotpasswordrequest";
import Quizmarks from "./Components/common/quiz/quizmarks";
import RecordVideo from "./Components/course/postcourse/video";
import Authenticateadmin from "./Components/Authenticate/authenticateadmin"
import Authenticateinstructor from "./Components/Authenticate/authenticateinstructor";
import Authenticatelearner from "./Components/Authenticate/authenticatelearner";
import Editprofile from "./Components/user/profile/editprofile"
function App() {
  return (
    <div>
      <BrowserRouter>
        <DenseAppBar />
        <Routes>
          //PUBLIC
          <Route path="/" element={<Getallcourse />} />
          <Route path="/login/learner" element={<Login />} />
          <Route path="/signup" element={<Signupoptions />} />
          <Route path="/signup/:role" element={<Signup />} />
          <Route path="/dashboard" element={<Showdashboard />} />
          <Route path="/profile" element={<Showprofile />} />
          <Route path="/viewcourse/:courseId" element={<Viewcourse />} />
          <Route path="/lessons/:lessonId" element={<Viewlesson />} />
          <Route path="/search" element={<DebounceDemo />} />
          <Route
            path="/allcourses/:categoryId"
            element={<Getallcoursebycategory />}
          />
          <Route
            path="/reset-password/:token/:userId"
            element={<Resetpassword />}
          />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/editmyprofile" element={<Editprofile />} />

         //INSTRUCTOR
          <Route element={<Authenticateinstructor />}>
            <Route path="/learners" element={<Viewmylearners />} />
            <Route path="/courses" element={<Getinstructorscourse />} />
            <Route path="/addcourse" element={<Addcourse />} />
            <Route path="/addlesson/:courseId" element={<Addlesson />} />
            <Route path="/updatecourse/:courseId" element={<Updatecourse />} />
            <Route path="/recordvideo" element={<RecordVideo />} />

            <Route
              path="/instructorlessons/:courseId"
              element={<Getinstructorslesson />}
            />
            <Route path="/createquiz/:lessonId" element={<Createquiz />} />

            <Route
              path="/showquizbylesson/:lessonId"
              element={<Showquizadmin />}
            />
            <Route path="/addquiz/:lessonId" element={<Addquiz />} />
            <Route
              path="/viewmystudentsassignments/:learnerId"
              element={<Viewmystudentsassignments />}
            />
          </Route>





          <Route element={<Authenticatelearner />}>
            <Route path="/quizmarks" element={<Quizmarks />} />
            <Route path="/viewcart/:learnerId" element={<Viewcart />} />
            <Route
              path="/getsubscribedcourses"
              element={<Getsubscribedcourse />}
            />
            <Route path="/viewwishlist" element={<Viewwishlist />} />
          </Route>

         //ADMIN
          <Route element={<Authenticateadmin />}>
            <Route path="/viewlearners" element={<Viewalllearners />} />
            <Route
              path="/approvecancelsubscription/:learnerId"
              element={<Approvecancelsubscription />}
            />
            <Route
              path="/viewunapprovedcourse"
              element={<Viewunapprovedcourse />}
            />
          </Route>



          

        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
