import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import useviewcoursehook from "../../../CustomHooks/useviewcoursehook";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import VideoContainer from "../../common/video/videocontainer";
import Imagecomponent from "../../common/image/image";
import ContentGrid from "../../common/content/contentgrid/contentgrid";
import AccordionItem from "../../common/content/accordionitem/accordionitem";
import CourseDetails from "../../common/content/coursedetails/coursedetails/coursedetails";
import LinearColor from "../../common/loader/loader";
import { List, ListItemButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/system";
import "../../../App.css";
import Heading4 from "../../form/common/heading/heading4";
import MoodIcon from "@mui/icons-material/Mood";
import Rating from "@mui/material/Rating";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ViewCourse = () => {
  const { courseId } = useParams();
  const [refresh, setRefresh] = useState(false);
  const { courseData, loading } = useviewcoursehook(courseId);
  const [reviewText, setReviewText] = useState("");
  console.log("courseData from get single course", courseData);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userdata"))
  );
  const [selectedStars, setSelectedStars] = useState(0);
  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
    console.log("reviewText", reviewText);
  };
  const handleStarClick = async (value) => {
    try {
      console.log("Star clicked:", value);
      setSelectedStars(value);
      document.querySelector(".ratevalue").value = value;
      await postData(value);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleSubmit = async (value) => {
    try {
      await postDataTwo(value);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const postData = async (value) => {
    try {
      const response = await axiosInstance.post("/addrate", {
        courseId: courseId,
        learnerId: userData._id,
        rate: value,
      });
      console.log("Rate added", response);
      toast(response.data.message);
      return response;
    } catch (error) {
      // toast.failure(error);
      console.error("Error adding rate", error);
      throw error;
    }
  };
  const postDataTwo = async () => {
    try {
      const response = await axiosInstance.post(
        `/addreview?courseId=${courseId}`,
        {
          learnerId: userData._id,
          text: reviewText,
        }
      );
      console.log("Review added", response);

      toast.success(response.data.message);
      setRefresh(!refresh);
      return response;
    } catch (error) {
      toast(error.response.data.message.error);
      console.error("Error adding review", error);
      throw error;
    }
  };

  console.log("courseData FOR RATING AND REVIEW", courseData);
  const [lessonData, setLessonData] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
      throw error;
    }
  };
  console.log("lessonData", lessonData);
  const Testimonial = ({ rating, text, author, position, imageSrc, alt }) => (
    <Grid item xs={12} sm={6} md={3}>
      <ToastContainer />
      <Card>
        <CardContent>
          <div className="testimonial-bubble">
            <div className="testimonial-rating">
              {[...Array(5).keys()].map((index) => (
                <span
                  key={index}
                  className={`fa fa-star ${index < rating ? "checked" : ""}`}
                ></span>
              ))}
            </div>
            <div className="testimonial-text">
              <Typography variant="body1" component="p">
                {text}
              </Typography>
            </div>
            <Typography variant="h6">{author}</Typography>
            <Typography variant="body2">{position}</Typography>
          </div>
          <div className="testimonial-author">
            <img src={imageSrc} alt={alt} />
          </div>
        </CardContent>
      </Card>
    </Grid>
  );

  // if (loading) {
  //   return <LinearColor />;
  // }
  console.log("The courseData is",courseData)
  return courseData? (
    <Grid container spacing={2} className="course-container">
      <Grid item xs={12} md={12} className="center-content">
        {courseData.title && (
          <Typography
            component="h2"
            variant="h5"
            className="course-title"
          >
            {courseData.title}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={12} className="center-content">
        <Card style={{ width: '1300px', margin: '10px auto' }}>
          <CardActionArea component="a" href="#">
            <div className="flex-container">
              <div className="text-content">
                <CourseDetails
                  title={courseData.title}
                  category={courseData.category}
                  type={courseData.type}
                  description={courseData.description}
                  courseId={courseData._id}
                />
              </div>
              <div className="image-container">
                <Imagecomponent courseData={courseData} />
              </div>
            </div>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={12}>
        <Card style={{ width: '1000px', margin: '10px auto' }}>
          <CardActionArea component="a" href="#">
            <CardContent style={{ textAlign: 'center' }}>
              <Typography variant="h5" component="div">
                Preview this course
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

            <VideoContainer
              width="80%"
              height={"80%"}
          
              url={courseData.intro}
              playing={false}
              muted={true}
              controls={true}
            />
            <CardContent>
              <ContentGrid courseData={courseData} />
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} md={12} className="your-center-class">
        <Typography variant="h6" component="div" style={{ width: '1300px', margin: '10px auto', textAlign:"center"}}>
          Contents
        </Typography>

        {Array.from({ length: courseData.content?.week || 0 }, (_, index) => (
          <div style={{ width: '1300px', margin: '10px auto' }}>
          <AccordionItem
            key={index}
            index={index}
            expanded={expanded}
            onChange={handleChange}
            fetchData={fetchData}
            lessonData={lessonData}
            courseId={courseId}
          />
          </div>
        ))}
      </Grid>
      <Grid item xs={12} md={12} className="your-center-class">
        <Grid container spacing={2}>
          <div className="wrapper">
            <div className="master">
              <h1>
                {courseData.ratings ? (
                  <h1>
                    <Rating
                      name="half-rating-read"
                      defaultValue={courseData.ratings.rate}
                      readOnly
                    />{" "}
                    <MoreVertIcon />
                    {courseData.ratings.rate} Course Rating
                  </h1>
                ) : (
                  <LinearColor />
                )}
              </h1>
              <h2>How was your experience about the course?</h2>

              <div className="rating-component">
                <div className="status-msg">
                  <label>
                    <input
                      className="rating_msg"
                      type="hidden"
                      name="rating_msg"
                      value=""
                    />
                  </label>
                </div>
                <div className="stars-box">
                  <Rating
                    name="rating"
                    value={selectedStars}
                    onChange={(event, newValue) => handleStarClick(newValue)}
                  />
                </div>
                <div className="starrate">
                  <label>
                    <input
                      className="ratevalue"
                      type="hidden"
                      name="rate_value"
                      value=""
                    />
                  </label>
                </div>
              </div>

              <div className="feedback-tags">
                {[1, 2, 3, 4, 5].map((set) => (
                  <div key={set} data-tag-set={set}>
                    <div className="question-tag">
                      {selectedStars === set &&
                        (() => {
                          switch (set) {
                            case 1:
                              return "Why was your experience so bad?";
                            case 2:
                              return "Why was your experience not good?";
                            case 3:
                              return "Why was your average rating experience?";
                            case 4:
                              return "Why was your experience good?";
                            default:
                              return "";
                          }
                        })()}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="tags-container" data-tag-set={5}>
                  <div className="make-compliment">
                    <div className="compliment-container">
                      Give a compliment
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="tags-box">
                  <TextField
                    type="text"
                    className="tag form-control"
                    name="comment"
                    id="inlineFormInputName"
                    placeholder="Please enter your review"
                    value={reviewText}
                    onChange={handleReviewTextChange}
                  />
                  <input
                    type="hidden"
                    name="product_id"
                    value="your-product-id"
                  />
                </div>
                <div className="button-box">
                  <Button
                    type="submit"
                    // className="done btn btn-warning"
                    onClick={handleSubmit}
                  >
                    Add review
                  </Button>
                </div>
              </div>

              <div className="submited-box">
                <div className="loader"></div>
                <div className="success-message">Thank you!</div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} className="your-center-class">
        <Grid container spacing={2} >
          {courseData.reviews && courseData.reviews.length > 0 ? (
            courseData.reviews.map((review, index) => (
              <Testimonial
                key={index}
                // rating={review.rating}
                text={review.text}
                author={review.learnerId.name}
                imageSrc={review.learnerId.image}
                alt={review.learnerId.name}
              />
            ))
          ) : (
            <LinearColor />
          )}
        </Grid>
      </Grid>

      {/* </> */}
    </Grid>
  ):(<LinearColor/>);
};
export default ViewCourse;