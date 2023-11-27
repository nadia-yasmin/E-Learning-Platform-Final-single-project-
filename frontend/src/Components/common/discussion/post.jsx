import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Container } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../../../Utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PostForm = ({ lessonData }) => {
  console.log("lessonData", lessonData);
  const [text, setPostContent] = useState("");
  console.log("text", text);
  const user = JSON.parse(localStorage.getItem("userdata"));
  const {
    control,
    handleSubmit,
    watchedPassword,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("data is ", data);
    createPost(data);
  };
  const createPost = async (data) => {
    try {
      const lessonId = lessonData._id;
      console.log("data", data);
      const formData = new FormData();
      formData.append("text ", text);
      formData.append("email ", user.email);
      const response = await axiosInstance.post(
        `/postdiscussion?lessonId=${lessonId}`,
        formData
      );
      console.log("Post discussion", response);
      toast.success(response.data.message);
      console.log("Send forget password email", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <Container component="main" maxWidth="xs">
        <ToastContainer />
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
          <Typography variant="h5" component="div" gutterBottom>
            Post Something
          </Typography>

          {/* <form
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
        </form> */}
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
          >
            <TextField
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              label="Write your post here"
              value={text}
              onChange={(e) => setPostContent(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "20px auto", display: "block" }}
            >
              Post
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default PostForm;
