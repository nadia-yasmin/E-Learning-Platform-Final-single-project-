import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axiosInstance";
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Buttoncomponent from "../../form/common/button/button"
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)({
    paddingTop:"200px",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom:"200px",

});

const StyledAvatar = styled(Avatar)({
  width: '100px',
  height: '100px',
});

const useStyles = styled((theme) => ({
    card: {
      maxWidth: 400,
      margin: "auto",
      marginTop: theme.spacing(10),
    },
    title: {
      textAlign: "center",
      fontSize: 24,
  
    },
    media: {
      height: 200,

    },
    content: {
      textAlign: "center",

    },
    editButton: {
      marginTop: theme.spacing(2),
    
    },
  }));

const Showprofile = () => {
  const userdata = JSON.parse(localStorage.getItem("userdata"));
  console.log("usedata from locl",userdata)
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/getprofile`);
        console.log("Profile RESPONSE", response.data.user);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
console.log("userdata.role",userdata.role)
  return (
    <StyledPaper>
      <StyledAvatar alt="Profile Picture" src={userData.image} />
      <Typography variant="h5" className={useStyles}>Name: {userData.name}</Typography>
      <Typography variant="body2" className={useStyles}>Email: {userData.email}</Typography>
      <Typography variant="body2" className={useStyles}>Role: {userdata.role}</Typography>
      <Buttoncomponent
            text={"Edit profile"}
            type={"submit"}
            variant={"contained"}
            style={{ ...useStyles, 
                marginLeft: '180px',
            fontSize: 'small', }} 
          />
    </StyledPaper>
  );
};

export default Showprofile;
