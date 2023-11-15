import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import useviewcoursehook from "../../../CustomHooks/useviewcoursehook";
import { useParams, useNavigate } from "react-router-dom";
const Viewcourse = () => {
  const { courseId } = useParams();
  console.log("courseId", courseId);
  const { courseData, loading } = useviewcoursehook(courseId);
  console.log("courseData from page", courseData);

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href="#">
        <Card sx={{ display: "flex" }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {courseData.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Category:{courseData.category}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Type:{courseData.type}
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
    </Grid>
  );
};

export default Viewcourse;
