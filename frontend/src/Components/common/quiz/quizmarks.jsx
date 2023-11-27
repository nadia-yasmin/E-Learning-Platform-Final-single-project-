import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, Paper } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../Utils/axiosInstance";
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShowErrorMessage from "../Error/filenotfound";
import { Doughnut } from "react-chartjs-2";
import { BarChart } from "@mui/x-charts/BarChart";
import "../../../App.css";
const defaultTheme = createTheme();

const Quizmarks = () => {
  const [score, setScore] = useState([]);
  const [total, setTotalScore] = useState([]);
  const [assignmentscore, setAssignmentScore] = useState([]);
  const [assignmenttotal, setAssignmentTotalScore] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userdata"));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/showprogress?learnerId=${userData._id}`
        );
        console.log("show quiz mark", response);
        setTotalScore(response.data.totalQuizzes);
        setScore(response.data.totalScore);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refresh]);
  useEffect(() => {
    const fetchDataTwo = async () => {
      try {
        const response = await axiosInstance.get(
          `/showassignmentscore?learnerId=${userData._id}`
        );
        console.log("show assignment mark", response);
        setAssignmentScore(response.data.totalScore);
        setAssignmentTotalScore(response.data.totalMark);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataTwo();
  }, [refresh]);
  console.log("score total", score, total);
  return (
    <Grid
      container
      spacing={0}
      justifyContent="center"
      alignItems="center"
      minHeight={"500px"}
    >
      <Grid item xs={12} sm={6}>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: ["Total Quiz Marks", "My Score"],
            },
          ]}
          series={[
            { data: [total], label: "Total Quiz Marks" },
            { data: [score], label: "My Score" },
          ]}
          width={500}
          height={300}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper
          style={{
            border: "2px dashed #aaa",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <p>Total Quiz Marks: {total}</p>
          <p>My Score: {score}</p>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: ["Total", "My Score"],
            },
          ]}
          series={[
            { data: [assignmenttotal], label: "Total Assignment Marks" },
            { data: [assignmentscore], label: "My Score" },
          ]}
          width={500}
          height={300}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <div
          style={{
            border: "2px dashed #aaa",
            padding: "5px",
            textAlign: "center",
          }}
        >
          <p>Total Assignment Marks: {assignmenttotal}</p>
          <p>My Score: {assignmentscore}</p>
        </div>
      </Grid>
    </Grid>
  );
};

export default Quizmarks;
