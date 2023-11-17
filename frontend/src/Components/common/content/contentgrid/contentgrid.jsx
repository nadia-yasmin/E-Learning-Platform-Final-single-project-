import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ContentNumbers from "../contentnumbers/contentnumber"

const ContentGrid = ({ courseData }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Number of contents:
      </Typography>
      {courseData && courseData.content && (
        <ContentNumbers content={courseData.content} />
      )}
    </Grid>
  </Grid>
);

export default ContentGrid;
