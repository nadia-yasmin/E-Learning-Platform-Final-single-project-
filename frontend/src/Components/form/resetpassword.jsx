import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Heading4 from "./common/heading/heading4";
import Buttoncomponent from "./common/button/button";
import { TextField, Stack } from "@mui/material";
import useLoginHook from "../../CustomHooks/useloginhook";
import { Container, Paper, Avatar, Grid } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
  backgroundColor:"#F4FBF8",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
  [theme.breakpoints.up("md")]: {
    maxWidth: "50%",
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: "30%",
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: "white",
  },
}));
const CenteredContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center" ,
  height: "80vh",
});
const Resetpassword = () => {
  const {
    control,
    handleSubmit,
    watchedPassword,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const { createLogin,successAlert, errorAlert, alertMessage  } = useLoginHook();
const {token}=useParams()
const {userId}=useParams()
  const handlePasswordChange = (e) => {
    setPasword(e.target.value);
  };
  const createPost = async (data) => {
    try {
      const formData = new FormData();
      console.log("token,userId",token,userId)
      console.log("data")
      formData.append("oldPassword", data.oldPassword);
      formData.append("newPassword", data.newPassword);
      console.log("formData",formData)

      const response = await axiosInstance.post(
        `/resetpassword?token=${token}&userId=${userId}`,
        formData
      );
      console.log("SINGLE LESSON RESPONSE", response);
    //   toast.success(response.data.message);
      
    } catch (error) {
      console.error("Error fetching data:", error.response.data);
      toast("Invalid Request");
    }
  };

  const onSubmit = (data) => {
    createPost(data);
  };

  return (
    <CenteredContainer>
        <ToastContainer/>
      <StyledPaper elevation={6}>
      <Avatar src="/broken-image.jpg" style={{ marginBottom: 16}} />
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} justifyContent="center" maxWidth="100%">
          <Grid item xs={12}>
              <Controller
                name="newPassword"
                control={control}
                rules={{
                  required: "password is required",
                  validate: (value) => {
                    const uppercaseRegex = /[A-Z]/;
                    const lowercaseRegex = /[a-z]/;
                    const specialCharRegex =
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

                    const digitRegex = /\d/;

                    if (
                      uppercaseRegex.test(value) &&
                      lowercaseRegex.test(value) &&
                      specialCharRegex.test(value) &&
                      digitRegex.test(value) &&
                      value.length >= 8
                    ) {
                      return true;
                    } else {
                      return "Password must meet the criteria";
                    }
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="password"
                    type="password"
                    placeholder="Enter Password"
                    {...field}
                    error={Boolean(errors.newPassword)}
                    helperText={errors.newPassword?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                // rules={{
                //   validate: (value) =>
                //     value === watchedPassword || "Both passwords don't match",
                // }}
                render={({ field }) => (
                  <TextField
                    label="confirm password"
                    type="password"
                    placeholder="Enter Confirm Password"
                    {...field}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Buttoncomponent
            text={"Change Password"}
            type={"submit"}
            variant={"contained"}
            style={{ marginTop: 16, backgroundColor:"#00695f"}} 
          />
        </form>
      </StyledPaper>
      {successAlert && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          {alertMessage}
        </Alert>
      )}
      {errorAlert && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {alertMessage}
        </Alert>
      )}
    </CenteredContainer>
    
  );
};


export default Resetpassword;
