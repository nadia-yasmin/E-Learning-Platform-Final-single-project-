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
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
const defaultTheme = createTheme();

const Getallcourse = () => {
  const { courseData, loading } = useCourseHook();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  let pageCount = 0;



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/getallcategories");
        setCategoryData(response.data.data.categories);
        console.log("Category response", response.data.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  console.log("courseData from page", courseData);
  if (courseData.length > 0) {
    pageCount = Math.ceil(courseData.length / itemsPerPage);
  }
  const handleCategoryClick = (categoryId) => {
    navigate(`/allcourses/${categoryId}`);
    console.log("Category ID is ", categoryId);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = courseData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        <Heading4
          text={"All Courses"}
          variant={"h4"}
          style={{
            color: "#00695f",
            textAlign: "center",
            fontSize: "1.5rem",
            paddingTop: "10px",
          }}
        />

        {/* Check if data is loaded before rendering */}
        {!loading && (
          <React.Fragment>
            <Getallcoursetemplate courseData={currentItems}/>
            <Stack marginLeft={"600px"} spacing={10}>
              <Pagination
                count={pageCount}
                variant="outlined"
                size="large"
                onChange={(event, value) => paginate(value)}
              />
            </Stack>
          </React.Fragment>
        )}

        <Heading4
          text={"All Categories"}
          variant={"h4"}
          style={{
            color: "#00695f",
            textAlign: "center",
            fontSize: "1.5rem",
            paddingTop: "10px",
          }}
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
