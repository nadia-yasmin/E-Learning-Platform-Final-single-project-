import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DenseAppBar from "./Components/navbar/navbar";
import Footer from "./Components/footer/footer";
import Login from "./Components/form/loginform";
import Signupoptions from "./Components/form/signupoptions";
import Signup from "./Components/form/signup";
import Getallcourse from "./Components/course/getcourse/getallcourse";
import Viewcourse from "./Components/course/getcourse/getsinglecourse";
import Viewlesson from "./Components/lesson/getlesson/getlessonbyid"
import Showdashboard from "./Components/common/dashboard/showdashboard"
import Showprofile from "./Components/user/profile/showprofile"
import Getinstructorscourse from "./Components/course/getcourse/getinstructorscourse"
import Addcourse from "./Components/course/postcourse/postcourse"
import "./App.css";
function App() {
  return (
    <div>
      <BrowserRouter>
        <DenseAppBar />
        <Routes>
          <Route path="/" element={<Getallcourse />} />
          <Route path="/login/learner" element={<Login />} />
          <Route path="/signup" element={<Signupoptions />} />
          <Route
            path="/signup/:role"
            element={<Signup />}
          />
           <Route
            path="/dashboard"
            element={<Showdashboard />}
          />
          <Route path="/profile" element={<Showprofile />} />
          <Route path="/viewcourse/:courseId" element={<Viewcourse />} />
          <Route path="/lessons/:lessonId" element={<Viewlesson />} />
          <Route path="/courses" element={<Getinstructorscourse />} />
          <Route path="/addcourse" element={<Addcourse />} />
          
          
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
