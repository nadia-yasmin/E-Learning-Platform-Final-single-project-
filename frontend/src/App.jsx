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
          <Route path="/viewcourse/:courseId" element={<Viewcourse />} />
          <Route path="/lessons/:lessonId" element={<Viewlesson />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
