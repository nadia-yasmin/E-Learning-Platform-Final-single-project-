// import toast from "react-toastify"
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axiosInstance";
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate,useParams} from "react-router-dom"
import "sweetalert2/dist/sweetalert2.css";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
const Getinstructorslesson = () => {
const [courseData, setCourseData] = useState([]);
const navigate= useNavigate()
const {courseId}=useParams()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/showlessonbycourse?courseId=${courseId}`);
        setCourseData(response.data.lessons);
        console.log("response", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const deleteCourse = async (courseId) => {
    try {
      const response = await axiosInstance.delete(`/deletecourse?courseId=${courseId}`,{ data: { courseId } });
      console.log("Course deleted successfully", response);
    } catch (error) {
      console.error("Could not delete course:", error);
    }
  };
  
  const handleDelete = (courseId) => {
    deleteCourse(courseId);
    console.log(`Delete clicked for course at index ${courseId}`);
  };
  
  const handleEdit = (courseId) => {
    navigate(`/updatecourse/${courseId}`)
    console.log(`Edit clicked for course at index ${courseId}`);
  };
  
  const handleAddQuiz = (courseId) => {
    navigate(`/createquiz/${courseId}`)
   };

   const handleShowQuiz = (lessonId) => {
    navigate(`/showquizbylesson/${lessonId}`)
   };
   
  return (
    // <div>Hi</div>
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', marginBottom: "800px" }}>
      <Typography variant="h4" component="div" gutterBottom>
        Lessons
      </Typography>
      {courseData ? (
      <div style={{ position: 'relative' }}>
        <List dense sx={{ width: '100%', maxWidth: 800, border: '1px solid #ddd', borderRadius: '8px' }}>
          {courseData.map((course, index) => {
            const labelId = `list-item-label-${index}`;
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt={`Avatar for ${course.title}`} src={course.image} />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={course.title} />
                  <IconButton onClick={() => handleDelete(course._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(course._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleAddQuiz(course._id)}>
                <AddIcon />
                  </IconButton>
                    <IconButton onClick={() => handleShowQuiz(course._id)}>
                      <ArrowForwardIcon />
                    </IconButton>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>): (
      <Typography variant="body1" gutterBottom>
        Your login has expired. Please log in again.
      </Typography>
    )}
    </Container>
  );
};

export default Getinstructorslesson;
