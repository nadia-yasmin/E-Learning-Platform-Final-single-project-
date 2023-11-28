import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Heading4 from "../../../form/common/heading/heading4";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LinearColor from "../../../common/loader/loader";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../Utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "react-toastify/dist/ReactToastify.css";
const defaultTheme = createTheme();
const Getallcoursetemplate = ({ courseData }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  let pageCount = 0;
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userdata"))
  );
  if (courseData.length > 0) {
    pageCount = Math.ceil(courseData.length / itemsPerPage);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = courseData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const addToCart = async (courseId) => {
    try {
      console.log("courseId", courseId);
      const response = await axiosInstance.post(
        `/addtocart?courseId=${courseId}`,
        {
          learnerId: userData._id,
          courseId: courseId,
        }
      );
      toast.success(response.data.message);
      console.log("Add to cart response", response);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error adding to cart:", error.response.data.message);
    }
  };
  const addToWishlist = async (courseId) => {
    try {
      console.log("courseId", courseId);
      const response = await axiosInstance.post(`/addtowishlist`, {
        learnerId: userData._id,
        courseId: courseId,
      });
      toast.success(response.data.message);
      console.log("Added to wishlist", response);
    } catch (error) {
      toast.error(error.response.data.error);
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToCart = (courseId) => {
    console.log("this is working");
    addToCart(courseId);
  };
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <ToastContainer />
      {courseData && courseData.length > 0 ? (
        <Grid container spacing={4}>
          {courseData.map((course) => (
            <Grid key={course.id} item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    // 16:9
                    pt: "56.25%",
                  }}
                  image={course.image}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {course.title}
                  </Typography>

                  <Typography>
                    {course?.instructor && course.instructor.name}
                  </Typography>

                  <Rating
                    name="read-only"
                    value={course.ratings.rate}
                    readOnly
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/viewcourse/${course._id}`)}
                  >
                    View course
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleAddToCart(course._id)}
                  >
                    <ShoppingCartIcon />
                  </Button>
                  <Button
                    size="small"
                    onClick={() => addToWishlist(course._id)}
                  >
                    <FavoriteBorderIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <LinearColor />
      )}
          </Container>
  );
};
export default Getallcoursetemplate;
