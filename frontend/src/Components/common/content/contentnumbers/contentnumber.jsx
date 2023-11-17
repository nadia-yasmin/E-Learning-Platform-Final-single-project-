import React from "react";
import Typography from "@mui/material/Typography";

const ContentNumbers = ({ content }) => (
  <>
    <Typography variant="subtitle1" color="text.secondary">
      Total videos: {content.videos || 0}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      Total slides: {content.slides || 0}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      Total quizzes: {content.quiz || 0}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      Total assignments: {content.assignment || 0}
    </Typography>
  </>
);

export default ContentNumbers;
