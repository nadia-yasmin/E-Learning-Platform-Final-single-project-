import React from "react";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/system";

const StyledCardMedia = styled(CardMedia)({
  width: 1350,
  height:400,
  objectFit: "cover",
  display: { xs: "none", sm: "block" }
});

const Imagecomponent2 = ({ courseData, lessonData,link }) => {
  return (
    <StyledCardMedia
      component="img"
      alt={courseData ? courseData.title : lessonData ? "Lesson Image" : ""}
      image={courseData ? courseData.image : lessonData ? lessonData.assignment.diagram : link? link :""}
    />
  );
};

export default Imagecomponent2;
