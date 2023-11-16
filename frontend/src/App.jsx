import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DenseAppBar from "./Components/navbar/navbar";
import Footer from "./Components/footer/footer";
import Login from "./Components/form/loginform";
import Signupoptions from "./Components/form/signupoptions";
import Adminsignup from "./Components/form/adminsignup";
import Instructorsignup from "./Components/form/instructorsignup";
import Learnersignup from "./Components/form/learnersignup";
import Getallcourse from "./Components/course/getcourse/getallcourse";
import Viewcourse from "./Components/course/getcourse/getsinglecourse";
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
          <Route path="/admin-signup/:role(admin)" element={<Adminsignup />} />
          <Route
            path="/instructor-signup/:role(instructor)"
            element={<Instructorsignup />}
          />
          <Route
            path="/learner-signup/:role(learner)"
            element={<Learnersignup />}
          />
          <Route path="/viewcourse/:courseId" element={<Viewcourse />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
