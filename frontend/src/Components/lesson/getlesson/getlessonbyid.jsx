import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../../../Utils/axiosInstance";

import {
  Card,
  CardContent,
  AppBar,
  Box,
  CardActionArea,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import CourseDetails from "../../common/content/coursedetails/coursedetails/coursedetails";
import VideoContainer from "../../common/video/videocontainer";
import "../../../App.css";
import LinearColor from "../../common/loader/loader";
import QuizForm from "../../common/quiz/quiz";
import Assignment from "../../common/assignment/assignment";
import PostForm from "../../common/discussion/post";
import Showdiscussion from "../../common/discussion/showdiscussion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Viewlesson = () => {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState([]);
  console.log("lessonData.quiz", lessonData.quiz);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/showlessonbyid?lessonId=${lessonId}`
        );
        console.log("SINGLE LESSON RESPONSE", response);
        setLessonData(response.data.lesson);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [lessonId]);
  console.log("lessonData", lessonData);
  const [value, setValue] = React.useState("one");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [loading, setLoading] = useState(true);
  const handleLoad = () => {
    setLoading(false);
  };
  const renderTabContent = () => {
    switch (value) {
      case "one":
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              maxWidth: "90vh",
              marginLeft: "450px",
              marginTop: "20PX",
              border: "2px dashed #4CAF50",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography>{lessonData.description}</Typography>
          </div>
        );
      case "two":
        return (
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                Reading Materials
              </Typography>
              {loading && <LinearColor />}
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  lessonData.slide
                )}&embedded=true`}
                style={{ width: "100%", height: "500px", border: "none" }}
                title="PowerPoint Presentation"
                onLoad={handleLoad}
              />
            </Grid>
          </Grid>
        );
      case "three":
        return (
          <>
            {lessonData.quiz && Array.isArray(lessonData.quiz.quiz) ? (
              <QuizForm
                quizData={lessonData.quiz.quiz}
                quizId={lessonData.quiz._id}
              />
            ) : (
              <p>No quiz data available.</p>
            )}
          </>
        );

      case "four":
        return <Assignment lessonData={lessonData} />;
      // return <div>hi</div>
      case "five":
        return (
          <div>
            {" "}
            <PostForm lessonData={lessonData} />
            <Showdiscussion lessonData={lessonData} />
          </div>
        );
      default:
        return null;
    }
  };
  return lessonData? (
    <Grid container spacing={2} alignItems={"center"} justifyContent="center">
      {/* First Grid Item */}
      <ToastContainer />
      <Grid item xs={12} md={12}>
        <Card>
          <CardActionArea component="a" href="#">
            <Card sx={{ display: "flex" }}>
              <CardContent sx={{ flex: 1 }}>
            
                <CourseDetails
                  number={lessonData.number}
                  title={lessonData.title}
                  // description={lessonData.description}
                />
    
              </CardContent>
            </Card>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={12}>
        <Card>
          <CardActionArea component="a" href="#">
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Published at: {lessonData?.createdAt}
              </Typography>
            </CardContent>
            <VideoContainer
              width="80%"
              height={"80%"}
              url={lessonData.video}
              playing={false}
              muted={true}
              controls={true}
            />
            {/* <CardContent>
                <ContentGrid courseData={courseData} />
              </CardContent> */}
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={12} justifyContent="center">
        {/* Tabs for navigation */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="one" label="Overview" />
            <Tab value="two" label="Slides" />
            <Tab value="three" label="Quiz" />
            <Tab value="four" label="Assignment" />
            <Tab value="five" label="Discussion" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Grid>
    </Grid>
  ):(<LinearColor/>);
};
export default Viewlesson;
