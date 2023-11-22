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
import LinearColor from "../../common/loader/loader"
import axiosInstance from "../../../Utils/axiosInstance";
import Getallcoursetemplate from "./common/getallcoursetemplate";
const defaultTheme = createTheme();

const Getallcourse = () => {
  const { courseData, loading } = useCourseHook();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/getallcategories');
        setCategoryData(response.data.data.categories);
        console.log("Category response", response.data.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
        showErrorAlert(error.message)
      }
    };
    fetchData();
  }, []);
  console.log("courseData from page", courseData);
  const handleCategoryClick = (categoryId) => {
    navigate(`/allcourses/${categoryId}`);
    console.log("Category ID is ", categoryId);
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        <Heading4
          text={"All Courses"}
          variant={"h4"}
          style={{ color: "#00695f", textAlign: "center", fontSize: "1.5rem", paddingTop: "10px" }}
        />
        <Getallcoursetemplate
          courseData={courseData}
        />
        <Heading4
          text={"Select by category"}
          variant={"h4"}
          style={{ color: "#00695f", textAlign: "center", fontSize: "1.5rem", paddingTop: "10px" }}
        />
        <Container sx={{ py: 8 }} maxWidth="md">
          {categoryData && categoryData.length > 0 ? (
            <Grid container spacing={4}>
              {categoryData.map((category) => (
                <Grid key={category._id} item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        // 16:9
                        pt: "56.25%",
                      }}
                      image={category.image}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {category.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <LinearColor />
          )}
        </Container>
      </main>
    </ThemeProvider>
  );
};

export default Getallcourse;
