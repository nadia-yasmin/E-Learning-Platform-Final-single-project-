// Import necessary components and functions
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Buttoncomponent from "../../form/common/button/button";
import axiosInstancefile from "../../../Utils/axiosinstanceform"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TextField,
  Stack,
  InputLabel,
  MenuItem,
  Select,
  Grid,
} from "@mui/material";
import { Container, Paper, Avatar } from "@mui/material";
import Input from "@mui/material/Input";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

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
  height: "120vh",
});

const Addlesson = () => {
  const { courseId } = useParams();
  const createPost = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("week", data.week);
      formData.append("video", data.video[0]);
      formData.append("assignment", data.assignment[0]);
      formData.append("assignmenttext", data.assignmenttext);
      formData.append("slides", data.slides[0]);
      const response = await axiosInstancefile.post(
        `/addlesson?courseId=${courseId}`,
        formData
      );
      toast.success(response.data.message);
      console.log("SINGLE LESSON RESPONSE", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  console.log("addlesson is working, courseId", courseId);
  const onSubmit = (data) => {
    console.log("data is ", data);
    createPost(data);
  };

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
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <TextField
                    label="Title"
                    type="text"
                    placeholder="Enter Title"
                    {...field}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <TextField
                    label="Description"
                    type="text"
                    placeholder="Enter Description"
                    {...field}
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="week"
                control={control}
                rules={{ required: "Week is required" }}
                render={({ field }) => (
                  <TextField
                    label="Week"
                    type="number"
                    placeholder="Enter Week"
                    {...field}
                    error={Boolean(errors.week)}
                    helperText={errors.week?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="video">Video File:</InputLabel>
              <Controller
                name="video"
                control={control}
                rules={{ required: "Video file is required" }}
                render={({ field }) => (
                  <Input
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={(e) => field.onChange(e.target.files)}
                    multiple
                  />
                )}
              />
              {errors.video && (
                <p style={{ color: "red" }}>{errors.video.message}</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <InputLabel htmlFor="video">Assuugnment image</InputLabel>
              <Controller
                name="assignment"
                control={control}
                rules={{ required: "Assignment image file is required" }}
                render={({ field }) => (
                  <Input
                    type="file"
                    name="assignment"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                    multiple
                  />
                )}
              />
              {errors.assignment && (
                <p style={{ color: "red" }}>{errors.assignment.message}</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="assignmenttext"
                control={control}
                rules={{ required: "Text for assignment is required" }}
                render={({ field }) => (
                  <TextField
                    label="Text for assignment"
                    type="text"
                    placeholder="Enter text for assignment"
                    {...field}
                    error={Boolean(errors.assignmenttext)}
                    helperText={errors.assignmenttext?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel htmlFor="video">Slides:</InputLabel>
              <Controller
                name="slides"
                control={control}
                rules={{ required: "Slides file is required" }}
                render={({ field }) => (
                  <Input
                    type="file"
                    name="slides"
                    accept="application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={(e) => field.onChange(e.target.files)}
                    multiple
                  />
                )}
              />
              {errors.slides && (
                <p style={{ color: "red" }}>{errors.slides.message}</p>
              )}
            </Grid>
          </Grid>
          <Buttoncomponent
            text={"Add Lesson"}
            type={"submit"}
            variant={"contained"}
            style={{ marginTop: 16, backgroundColor: "#00695f" }}
          />
        </form>
      </StyledPaper>
    </CenteredContainer>
  );
};

export default Addlesson;