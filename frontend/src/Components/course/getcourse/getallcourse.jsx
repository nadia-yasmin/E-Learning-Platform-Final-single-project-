import * as React from "react";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Heading4 from "../../form/common/heading/heading4";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useCourseHook from "../../../CustomHooks/usegetcoursehook";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const defaultTheme = createTheme();

const Getallcourse = () => {
  const { courseData, loading } = useCourseHook();
  const navigate = useNavigate();
  console.log("courseData from page", courseData);
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        <Heading4
          text={"Learners are also viewing"}
          variant={"h4"}
          style={{ color: "#00695f", textAlign: "center", fontSize: "1.5rem" }}
        />
        <Container sx={{ py: 8 }} maxWidth="md">
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
                      <Button size="small">
                        <ShoppingCartIcon />
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <div>No course data available</div>
          )}
        </Container>
      </main>
    </ThemeProvider>
  );
};

export default Getallcourse;
