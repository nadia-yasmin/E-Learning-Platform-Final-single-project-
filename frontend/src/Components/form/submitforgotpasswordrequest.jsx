import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Buttoncomponent from "./common/button/button";
import { TextField, Stack } from "@mui/material";
import usesignuphook from "../../CustomHooks/useSignuphook";
import { Container, Paper, Avatar, Grid } from "@mui/material";
import Input from "@mui/material/Input";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import axiosInstance from "../../Utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
  backgroundColor: "#F4FBF8",
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
  textAlign: "center",
  height: "90vh",
});
const Forgotpassword = () => {
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const onSubmit = (data) => {
    console.log("data is ", data);
    createPost(data);
  };
  const createPost = async (data) => {
    try {
      const formData = new FormData();
      formData.append("recipient", data.recipient);
      const response = await axiosInstance.post(
        `/sendforgetpasswordemail`,
        formData
      );
      toast.success(response.data.message);
      console.log("Send forget password email", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const watchedPassword = watch("password", "");
  return (
    <CenteredContainer>
      <ToastContainer />
      <StyledPaper elevation={6}>
        <Avatar src="/broken-image.jpg" style={{ marginBottom: 16 }} />
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <Grid container spacing={3} justifyContent="center" maxWidth="100%">
            <Grid item xs={12}>
              <Controller
                name="recipient"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                    {...field}
                    error={Boolean(errors.recipient)}
                    helperText={errors.recipient?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Buttoncomponent
            text={"Send Change Request"}
            type={"submit"}
            variant={"contained"}
            style={{ marginTop: 16, backgroundColor: "#00695f" }}
          />
        </form>
      </StyledPaper>
    </CenteredContainer>
  );
};

export default Forgotpassword;
