import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DenseAppBar from "./Components/navbar/navbar";
import Login from "./Components/form/loginform";
import "./App.css";
function App() {
  return (
    <div>
      <BrowserRouter>
        <DenseAppBar />
        <Routes>
          <Route path="/login/learner" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
