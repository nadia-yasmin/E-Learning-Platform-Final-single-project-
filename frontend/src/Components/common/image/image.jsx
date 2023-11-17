import React from "react";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/system";

const StyledCardMedia = styled(CardMedia)({
  width: 350,
  objectFit: "cover",
  display: { xs: "none", sm: "block" }
});

const Imagecomponent = ({ courseData}) => {
  return (
    <StyledCardMedia
      component="img"
      alt={courseData.title}
      image={courseData.image}
    />
  );
};

export default Imagecomponent;
