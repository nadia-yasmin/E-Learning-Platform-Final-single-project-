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
import {useNavigate} from "react-router-dom"
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
const Getinstructorscourse = () => {
    const showSuccessAlert = (message) => {
        Swal.fire({
          title: "Success",
          text: message,
          icon: "success",
        });
      };
    
      const showErrorAlert = (errorMessage) => {
        Swal.fire({
          title: "Error",
          html: errorMessage,
          icon: "error",
        });
      };
  const [courseData, setCourseData] = useState([]);
const navigate= useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem('userdata');
        if (!userDataString) {
          console.error("User data not found in local storage");
          return;
        }
        const userData = JSON.parse(userDataString);
        console.log("userData", userData._id);
        const response = await axiosInstance.post('/getinstructorscourse', {
          instructorId: userData._id,
        });
        setCourseData(response.data.data.courses);
        console.log("response", response);
      } catch (error) {
        console.error("Error fetching data:", error);
        showErrorAlert(error.message)
      }
    };

    fetchData();
  }, []);

  const handleDelete = (index) => {
    // Implement your delete logic here
    console.log(`Delete clicked for course at index ${index}`);
  };

  const handleEdit = (index) => {
    // Implement your edit logic here
    console.log(`Edit clicked for course at index ${index}`);
  };

  const handleAddCourse = () => {
   navigate("/addcourse")
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', marginBottom: "800px" }}>
      <Typography variant="h4" component="div" gutterBottom>
        Courses
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
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <IconButton sx={{ position: 'absolute', top: '0px', right: '5px', marginTop: '-40px' }} onClick={handleAddCourse}>
          <AddIcon />
        </IconButton>
      </div>): (
      <Typography variant="body1" gutterBottom>
        Your login has expired. Please log in again.
      </Typography>
    )}
    </Container>
  );
};

export default Getinstructorscourse;
