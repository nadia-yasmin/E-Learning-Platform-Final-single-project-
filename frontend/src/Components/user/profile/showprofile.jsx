import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axiosInstance";
import { Paper, Avatar, Typography, Grid } from "@mui/material";
import Buttoncomponent from "../../form/common/button/button"
import { styled } from '@mui/system';
import ShowErrorMessage from "../../common/Error/filenotfound";
import {useNavigate} from "react-router-dom"
import Button from '@mui/material/Button';
const StyledPaper = styled(Paper)({
  paddingTop: "200px",
  border: "1px solid #ddd", 
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: "200px",
});


const StyledAvatar = styled(Avatar)({
  width: '100px',
  height: '100px',
});


const ShowProfile = () => {
  const userdata = JSON.parse(localStorage.getItem("userdata"));
  const navigate= useNavigate()
  console.log("usedata from locl", userdata);
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/getprofile`);
        console.log("Profile RESPONSE", response);
  
        if (response.data.message) {
          setErrorMessage(response.data.message);
        } else {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  if (errorMessage) {
    return <ShowErrorMessage errorMessage={errorMessage} />;
  }
  const handleEditProfileClick = () => {
    navigate('/editmyprofile');
  };

  console.log("userdata.role", userdata.role);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledPaper>
          <StyledAvatar alt="Profile Picture" src={userData.image} />
          <Typography variant="h5">{`Name: ${userData.name}`}</Typography>
          <Typography variant="body2">{`Email: ${userData.email}`}</Typography>
          <Typography variant="body2">{`Role: ${userData.role}`}</Typography>
          <Button variant="contained"  onClick={handleEditProfileClick}>Edit Profile</Button>
          {/* <Buttoncomponent
            text="Edit profile"
            variant="contained"
            style={{
              marginLeft: '180px',
              fontSize: 'small',
            }}
            onSubmit={handleEditProfileClick}
          /> */}
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default ShowProfile;
