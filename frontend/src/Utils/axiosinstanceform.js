import axios from "axios";
const token = localStorage.getItem("token");
const axiosInstancefile = axios.create({
  baseURL: "http://127.0.0.1:8000/course",
  headers: {
    "Content-Type": "multipart/form-data",
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
  timeout: 5000000,
});

export default axiosInstancefile;