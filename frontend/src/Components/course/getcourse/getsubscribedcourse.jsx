import React, { useState, useEffect } from "react";
import Heading4 from "../../form/common/heading/heading4";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useCourseHook from "../../../CustomHooks/usegetcoursehook";
import { useNavigate } from "react-router-dom";
import LinearColor from "../../common/loader/loader";
import axiosInstance from "../../../Utils/axiosInstance";
import Getallcoursetemplate from "./common/getallcoursetemplate";
const defaultTheme = createTheme();

const Getsubscribedcourse = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userdata"));
  console.log("userData", userData);
  const [courseData, setCourseData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/showsubscribedcourse?learnerId=${userData._id}`
        );
        setCourseData(response.data.subscribedCourses);
        console.log(
          "Subscribed course response",
          response.data.subscribedCourses
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  console.log("My Courses", courseData);
  return (
    // <div>Hi</div>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        <Heading4
          text={"My Courses"}
          variant={"h4"}
          style={{
            color: "#00695f",
            textAlign: "center",
            fontSize: "1.5rem",
            paddingTop: "10px",
          }}
        />
        <Getallcoursetemplate courseData={courseData} />
      </main>
    </ThemeProvider>
  );
};

export default Getsubscribedcourse;
