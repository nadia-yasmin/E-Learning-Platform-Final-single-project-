import axiosInstance from "../Utils/axiosInstance";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
const usesignuphook = (role) => {
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
  const createPost = (data) => {
    const formData = new FormData();
    console.log("data", data);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("name", data.name);
    formData.append("file", data.file);
    axiosInstance
      .post(`/adduser?role=${role}`, formData)
      .then((response) => response.data)
      .then((data) => {
        console.log("Successfully added user:", data);
        showSuccessAlert(JSON.stringify(data.message));
        return data;
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        showErrorAlert(JSON.stringify(error.response.data.message));
        throw error;
      });
  };

  return { createPost };
};

export default usesignuphook;
