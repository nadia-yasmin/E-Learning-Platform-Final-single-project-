import React from "react";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/system";

const StyledCardMedia = styled(CardMedia)({
  width: 350,
  objectFit: "cover",
  display: { xs: "none", sm: "block" }
});

const Imagecomponent = ({ courseData, lessonData }) => {
  return (
    <StyledCardMedia
      component="img"
      alt={courseData ? courseData.title : lessonData ? "Lesson Image" : ""}
      image={courseData ? courseData.image : lessonData ? lessonData.assignment.diagram : ""}
    />
  );
};

export default Imagecomponent;
