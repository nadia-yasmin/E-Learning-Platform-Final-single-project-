import { useState, useEffect, useContext } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
const useLoginHook = (token, userId, newPassword, oldPassword, role) => {
  const showSuccessAlert = (message) => {
    Swal.fire({
      title: "Success",
      text: message,
      icon: "success",
    });
  };
  const showErrorAlert = (errorMessage) => {
    Swal.fire({
      title: "Error",
      html: errorMessage,
      icon: "error",
    });
  };
  const dispatch = useDispatch();
  const createLogin = (formData) => {
    console.log("formData", formData);
    axiosInstance
      .post("/login", formData)
      .then((response) => response.data)
      .then((data) => {
        if (data.success) {
          const token = data.data.token;
          showSuccessAlert(data.message);
          localStorage.setItem("logindata", data.data.role);
          localStorage.setItem("token", token);
          dispatch(login(data.data.role));
        }
        console.log("Successfully logged in:", data);
        localStorage.setItem("responseData", data.message);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        showErrorAlert(error.response.data.message);
      });
  };

  return { createLogin };
};

export default useLoginHook;
