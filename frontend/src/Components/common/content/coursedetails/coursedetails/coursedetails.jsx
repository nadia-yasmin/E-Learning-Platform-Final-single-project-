import React from 'react';
import Typography from '@mui/material/Typography';

const CourseDetails = ({ number, title, category, type, description }) => (
  <>
  {number && (
      <Typography component="h2" variant="h5">
        Lesson: {number}
      </Typography>
    )}
    {title && (
      <Typography component="h2" variant="h5">
        {title}
      </Typography>
    )}
    {category && (
      <Typography variant="subtitle1" color="text.secondary">
        Category: {category}
      </Typography>
    )}
    {type && (
      <Typography variant="subtitle1" color="text.secondary">
        Type: {type}
      </Typography>
    )}
    {description && (
      <Typography variant="subtitle1" paragraph>
        Course description: {description}
      </Typography>
    )}
    {description && (
      <Typography variant="subtitle1" color="primary">
        Continue reading...
      </Typography>
    )}
  </>
);

export default CourseDetails;
