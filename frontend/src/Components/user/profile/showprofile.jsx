import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axiosInstance";
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Buttoncomponent from "../../form/common/button/button"
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import ShowErrorMessage from "../../common/Error/filenotfound";
const StyledPaper = styled(Paper)({
  paddingTop: "200px",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: "200px",
});

const StyledAvatar = styled(Avatar)({
  width: '100px',
  height: '100px',
});

const NotFoundContainer = styled('div')({
  width: '100%',
  height: '100vh',
  backgroundColor: '#0a1821',
  fontFamily: 'Roboto, Arial, sans-serif',
  color: '#fff',
  textAlign: 'center',
});

const NotFoundImage = styled('img')({
  width: '560px',
  height: '225px',
  marginRight: '-10px',
});

const NotFoundContent = styled('div')({
  paddingTop: '200px',
  paddingBottom: '200px',
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

const ShowProfile = () => {
  const userdata = JSON.parse(localStorage.getItem("userdata"));
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
  

  console.log("userdata.role", userdata.role);

  return (
    <StyledPaper>
      <StyledAvatar alt="Profile Picture" src={userData.image} />
      <Typography variant="h5" className={useStyles.title}>Name: {userData.name}</Typography>
      <Typography variant="body2" className={useStyles.content}>Email: {userData.email}</Typography>
      <Typography variant="body2" className={useStyles.content}>Role: {userdata.role}</Typography>
      <Buttoncomponent
        text={"Edit profile"}
        type={"submit"}
        variant={"contained"}
        style={{
          ...useStyles,
          marginLeft: '180px',
          fontSize: 'small',
        }}
      />
    </StyledPaper>
  );
};

export default ShowProfile;
