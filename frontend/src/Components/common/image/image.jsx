import React from "react";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/system";

const StyledCardMedia = styled(CardMedia)({
  marginTop:"5px",
  marginLeft:"425px",
  width: 150,
  height: 150, 
  objectFit: "cover",
  display: { xs: "none", sm: "block" },
});
const Imagecomponent = ({ courseData, lessonData,link }) => {
  return (
    <StyledCardMedia
      component="img"
      alt={courseData ? courseData.title : lessonData ? "Lesson Image" : ""}
      image={courseData ? courseData.image : lessonData ? lessonData.assignment.diagram : link? link :""}
    />
  );
};

export default Imagecomponent;
