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
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
const defaultTheme = createTheme();
const DebounceDemo = () => {
  const searchParam = useSelector((state) => state.course.searchParam);
  const courseData = useSelector((state) => state.course.courseData);
  const loading = useSelector((state) => state.course.loading);
  const error = useSelector((state) => state.course.error);
  const dispatch = useDispatch();
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
export default DebounceDemo;