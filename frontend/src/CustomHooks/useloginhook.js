import { useState, useEffect, useContext } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {useNavigate} from "react-router-dom"
const useLoginHook = (token, userId, newPassword, oldPassword, role) => {
 
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate=useNavigate()
  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setSuccessAlert(true);
  };

  const showErrorAlert = (errorMessage) => {
    setAlertMessage(errorMessage);
    setErrorAlert(true);
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
          // showSuccessAlert(data.message);
          navigate("/dashboard")
          localStorage.setItem("userdata", JSON.stringify(data.data));
          localStorage.setItem("token", token);
          console.log("userdata token",data.data,token)
        }
        console.log("Successfully logged in:", data);
        localStorage.setItem("responseData", data.message);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        showErrorAlert(error.response.data.message);
      });
  };

  return { createLogin ,successAlert, errorAlert, alertMessage };
};

export default useLoginHook;
