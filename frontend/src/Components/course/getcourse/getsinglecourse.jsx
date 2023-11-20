import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import useviewcoursehook from "../../../CustomHooks/useviewcoursehook";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import VideoContainer from "../../common/video/videocontainer";
import Imagecomponent from "../../common/image/image"
import ContentGrid from "../../common/content/contentgrid/contentgrid"
import AccordionItem from "../../common/content/accordionitem/accordionitem"
import CourseDetails from "../../common/content/coursedetails/coursedetails/coursedetails";
import { List, ListItemButton } from "@mui/material";
import { styled } from "@mui/system";

import "../../../App.css";

const ViewCourse = () => {
  const { courseId } = useParams();
  const { courseData, loading } = useviewcoursehook(courseId);
  const [week, setCurrentWeek] = useState(1);
  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: "white",
  }));
  const [lessonData, setLessonData] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const StyledList = styled(List)({
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "16px",
  });
  const StyledListItemButton = styled(ListItemButton)({
    "&:hover": {
      backgroundColor: "#e0e0e0",
      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    },
    border: "1px solid #ddd",
    marginBottom: "8px",
  });
  const fetchData = async (week, courseId) => {
    try {
      const response = await axiosInstance.get(
        `/showlessonbyweek?courseId=${courseId}&week=${week}`
      );
      console.log("Response  dekhay naaaaa,RESPONSE, WEEK", response, week);
      setLessonData(response.data.sortedLessons);
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to let the component handle it if needed.
    }
  };
  console.log("lessonData", lessonData);

  if (loading) {
    return (
      <Container>
        <Skeleton variant="rectangular" height={200} />
        <Skeleton height={20} width="80%" />
        <Skeleton height={20} width="50%" />
      </Container>
    );
  }

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignContent: "center",
    //   }}
    // >
      <Grid container spacing={2}>
        {/* First Grid Item */}
        <Grid item xs={12} md={12}>
          <Card>
            <CardActionArea component="a" href="#">
              <Card sx={{ display: "flex" }}>
                <CardContent sx={{ flex: 1 }}>
                <CourseDetails
                  title={courseData.title}
                  category={courseData.category}
                  type={courseData.type}
                  description={courseData.description}
                  courseId={courseData._id}
                />

                </CardContent>
                <Imagecomponent courseData={courseData} />
              </Card>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Second Grid Item */}
        <Grid item xs={12} md={12}>
          <Card>
            <CardActionArea component="a" href="#">
              <CardContent>
                <Typography variant="h5" component="div">
                  Preview this course: {courseData.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Published at: {courseData?.createdAt}
                  {courseData?.instructor && (
                    <>
                      {" by "}
                      {courseData.instructor.name}
                    </>
                  )}
                </Typography>
              </CardContent>
              <VideoContainer width="80%"
                height={"80%"}
                url={courseData.intro}
                playing={false}
                muted={true}
                controls={true} />
              <CardContent>
                <ContentGrid courseData={courseData} />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} md={12} sx={{ justifyContent: 'center' }}>
  {/* <Container maxWidth="sm" textAlign="center">
    <div sx={{ width: '100%' }}> */}
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Contents
      </Typography>
      {Array.from({ length: courseData.content?.week || 0 }, (_, index) => (
        <AccordionItem
          key={index}
          index={index}
          expanded={expanded}
          onChange={handleChange}
          fetchData={fetchData}
          lessonData={lessonData}
          courseId={courseId}
        />
      ))}
    {/* </div>
  </Container> */}
</Grid>

      </Grid>
    // </div>
  );
};
export default ViewCourse;
