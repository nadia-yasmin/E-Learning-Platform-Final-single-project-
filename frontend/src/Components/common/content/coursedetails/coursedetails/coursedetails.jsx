import React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
const CourseDetails = ({
  number,
  title,
  category,
  type,
  description,
  courseId,
}) => (
  <>
    {/* {number && (
      <Typography component="h2" variant="h5">
        Lesson: {number}
      </Typography>
    )}
    {title && (
      <Typography component="h2" variant="h5"   style={{
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '8px', 
        marginLeft:"600px"
      }}>
        {title}
      </Typography>
    )} */}
    
    <List>
        {category && (
          <ListItem>
            <ListItemText>
              <Typography variant="subtitle1" color="text.secondary">
                &#8594; Category: {category}
              </Typography>
            </ListItemText>
          </ListItem>
        )}

        {type && (
          <ListItem>
            <ListItemText>
              <Typography variant="subtitle1" color="text.secondary">
                &#8594; Type: {type}
              </Typography>
            </ListItemText>
          </ListItem>
        )}

        {description && (
          <ListItem>
            <ListItemText>
              <Typography variant="subtitle1" paragraph>
                &#8594; Course description: {description}
              </Typography>
            </ListItemText>
          </ListItem>
        )}

        {courseId && (
          <ListItem>
            <ListItemText>
              <Typography
                variant="subtitle1"
                color="primary"
                component={Link}
                to={`/addlesson/${courseId}`}
              >
                &#8594; Continue reading...
              </Typography>
            </ListItemText>
          </ListItem>
        )}
        {number && (
          <ListItem>
            <ListItemText>
              <Typography
                variant="subtitle1"
                color="primary"
              >
                Lesson no: {number}
              </Typography>
            </ListItemText>
          </ListItem>
        )}
        {title && (
          <ListItem>
            <ListItemText>
              <Typography
                variant="subtitle1"
                color="primary"
              >
                  Title: {title}
              </Typography>
            </ListItemText>
          </ListItem>
        )}
      </List>
  </>
);

export default CourseDetails;