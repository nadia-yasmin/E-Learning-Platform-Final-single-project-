import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DenseAppBar from "./Components/navbar/navbar";
import Login from "./Components/form/loginform";
import Signupoptions from "./Components/form/signupoptions";
import Adminsignup from "./Components/form/adminsignup";
import "./App.css";
function App() {
  return (
    <div>
      <BrowserRouter>
        <DenseAppBar />
        <Routes>
          <Route path="/login/learner" element={<Login />} />
          <Route path="/signup" element={<Signupoptions />} />
          {/* /products/${product._id} */}
          <Route path="/admin-signup/:role(admin)" element={<Adminsignup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
