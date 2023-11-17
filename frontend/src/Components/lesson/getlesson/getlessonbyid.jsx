import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import { Card, CardContent, AppBar, Box, CardActionArea, CardMedia, Typography, CardActions, Button, Grid, Tabs, Tab, } from '@mui/material';
import CourseDetails from "../../common/content/coursedetails/coursedetails/coursedetails";
import VideoContainer from "../../common/video/videocontainer";
import "../../../App.css";
import LinearColor from "../../common/loader/loader";
import QuizForm from "../../common/quiz/quiz";
import Assignment from "../../common/assignment/assignment"
const Viewlesson = () => {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState([]);
  console.log("lessonData.quiz",lessonData.quiz)
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
  const [value, setValue] = React.useState('one');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [loading, setLoading] = useState(true);
 const handleLoad = () => {
    setLoading(false);
  };
  const renderTabContent = () => {
    switch (value) {
      case 'one':
        return <Typography>{lessonData.description}</Typography>;
      case 'two':
        return <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Reading Materials
          </Typography>
          {loading && <LinearColor />}
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(lessonData.slide)}&embedded=true`}
            style={{ width: '100%', height: '500px', border: 'none' }}
            title="PowerPoint Presentation"
            onLoad={handleLoad}
          />
        </Grid>
      </Grid>;
      case 'three':
        return (
          <>
            {lessonData.quiz && Array.isArray(lessonData.quiz.quiz) ? (
              <QuizForm quizData={lessonData.quiz.quiz} />
            ) : (
              <p>No quiz data available.</p>
            )}
          </>
        );
        

      case 'four':
        return <Assignment lessonData={lessonData} />
        // return <div>hi</div>
      case 'five':
        return <Typography>Discussion Content</Typography>;
      default:
        return null;
    }
  };
  return (<Grid container spacing={2} alignItems={"center"} justifyContent="center">
    {/* First Grid Item */}
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
          <VideoContainer width="80%"
            height={"80%"}
            url={lessonData.video}
            playing={false}
            muted={true}
            controls={true} />
          {/* <CardContent>
                <ContentGrid courseData={courseData} />
              </CardContent> */}
        </CardActionArea>
      </Card>
    </Grid>
    <Grid item xs={12} md={12} justifyContent="center">
      {/* Tabs for navigation */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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

  )
};
export default Viewlesson;
