import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import ReactPlayer from "react-player";
import useviewcoursehook from "../../../CustomHooks/useviewcoursehook";
import useviewlessonhook from "../../../CustomHooks/useviewlessonhook";
import { useParams, useNavigate, Link } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import axiosInstance from "../../../Utils/axiosInstance";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Grid container spacing={2}>
        {/* First Grid Item */}
        <Grid item xs={12} md={12}>
          <Card>
            <CardActionArea component="a" href="#">
              <Card sx={{ display: "flex" }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography component="h2" variant="h5">
                    {courseData.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Category: {courseData.category}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Type: {courseData.type}
                  </Typography>
                  <Typography variant="subtitle1" paragraph>
                    Course description: {courseData.description}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    Continue reading...
                  </Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  sx={{ width: 160, display: { xs: "none", sm: "block" } }}
                  image={courseData.image}
                />
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
                  Introduction to: {courseData.title}
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
              <Container maxWidth="md" className="playerDiv">
                <ReactPlayer
                  width="80%"
                  height="80%"
                  url={courseData.intro}
                  playing={false}
                  muted={true}
                  controls={true}
                />
              </Container>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      sx={{ mt: 4, mb: 2 }}
                      variant="h6"
                      component="div"
                    >
                      Number of contents:
                    </Typography>
                    {courseData && courseData.content && (
                      <>
                        <Typography variant="subtitle1" color="text.secondary">
                          Total videos:{" "}
                          {courseData ? courseData.content.videos : 0}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          Total slides: {courseData.content.slides}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          Total quizzes: {courseData.content.quiz}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          Total assignments: {courseData.content.assignment}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} sx={{ justifyContent: "center" }}>
          <Container maxWidth="sm">
            <div>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Contents
              </Typography>
              {Array.from(
                { length: courseData.content?.week || 0 },
                (_, index) => (
                  <Accordion
                    key={index}
                    expanded={expanded === `panel${index}`}
                    onChange={handleChange(`panel${index}`)}
                  >
                    <AccordionSummary
                      onClick={() => fetchData(index + 1, courseId)}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}bh-content`}
                      id={`panel${index}bh-header`}
                    >
                      <Typography sx={{ width: "33%", flexShrink: 0 }}>
                        Week {index + 1}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <nav aria-label="secondary mailbox folders">
                        <StyledList>
                          {lessonData.map((lesson, lessonIndex) => (
                            <ListItem key={lessonIndex} disablePadding>
                              <StyledListItemButton
                                component={Link}
                                to={`/lessons/${lesson._id}`}
                              >
                                <ListItemText primary={lesson.title} />
                              </StyledListItemButton>
                            </ListItem>
                          ))}
                        </StyledList>
                      </nav>
                    </AccordionDetails>
                  </Accordion>
                )
              )}
            </div>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};
export default ViewCourse;
