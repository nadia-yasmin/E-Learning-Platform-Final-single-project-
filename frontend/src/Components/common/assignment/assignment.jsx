import React, { useState } from "react";
import {
  Paper,
  Typography,
  Radio,
  FormControlLabel,
  Snackbar,
  styled,
  Input,
  Grid,
} from "@mui/material";
import Imagecomponent from "../image/image";
import Buttoncomponent from "../../form/common/button/button";
import { useForm, Controller } from "react-hook-form";
import axiosInstancefile from "../../../Utils/axiosinstanceform"
import { ToastContainer, toast } from "react-toastify";
import Heading4 from "../../form/common/heading/heading4";
import "react-toastify/dist/ReactToastify.css";
const Assignment = ({ lessonData}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const learnerId = JSON.parse(localStorage.getItem("userdata"))._id;
  const createPost = async (data) => {
    try {
      const formData = new FormData();
      formData.append("learnerId", learnerId);
      formData.append("file", data.file[0]);
  
      const response = await axiosInstancefile.post(
        `/submitassignment?lessonId=${lessonData._id}`,
        formData
      );
      toast.success(response.data.message);
      console.log("Submit assign,emt RESPONSE", response);
    } catch (error) {
      toast.error(error.response.data.error);
      console.error("Error fetching data:", error);
    }
  };
  const onSubmit = (data) => {
    console.log(data);
    createPost(data);
  };

  return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
   <Grid container justifyContent="center" alignItems="center">
  <ToastContainer />
  <Grid item xs={12} md={8} style={{ marginLeft: "40px", textAlign: "center" }}>
    <Typography variant="h5" gutterBottom style={{ padding: "10px" }}>
      Assignment
    </Typography>
    <Imagecomponent lessonData={lessonData} />
    <Typography variant="h5" gutterBottom style={{ padding: "10px" }}>
      {lessonData.assignment.text}
    </Typography>
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      style={{ padding: "10px" }}
    >
      <Controller
        name="file"
        control={control}
        rules={{ required: "File is required" }}
        defaultValue={[]}
        render={({ field }) => (
          <Input
            type="file"
            name="file"
            accept=".ppt, .pptx, .pdf, .doc, .docx"
            onChange={(event) => field.onChange(event.target.files)}
            multiple
            error={Boolean(errors.file)}
            helperText={errors.file?.message}
          />
        )}
      />
      <Buttoncomponent
        text={"Submit"}
        type={"submit"}
        variant={"contained"}
        style={{
          marginTop: 16,
          marginLeft: "450px",
          backgroundColor: "#00695f",
        }}
      />
    </form>
  </Grid>
</Grid>

  </div>
  
  );
};

export default Assignment;
