import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, InputLabel,FormControl,Select } from "@mui/material";
import { Paper, Avatar, Grid } from "@mui/material";
import Buttoncomponent from "../../form/common/button/button";
import MenuItem from "@mui/material/MenuItem";
import axiosInstance from "../../../Utils/axiosInstance";
import { styled } from "@mui/system";
import {useParams} from "react-router-dom"
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
  height: "120vh",
});

const Addquiz = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    register
  } = useForm();
const {lessonId}= useParams();
const createPost = async (data) => {
    try {
      const response = await axiosInstance.post(
        `/addquiz?lessonId=${lessonId}`,
        data
      );
      toast.success(response.data.message);
      console.log("Quiz created", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
console.log("lessonId",lessonId)
  const onSubmit = (data) => {
    createPost(data)
    console.log(data);
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

          <InputLabel htmlFor="question">Question</InputLabel>
          <TextField
            label="Question"
            name="question"
            type="text"
            placeholder="Enter Question"
            fullWidth
            {...register("question", { required: "Question is required" })}
            error={Boolean(errors.question)}
            helperText={errors.question?.message}
          />
          {[1, 2, 3, 4].map((index) => (
        <div key={index}>
          <InputLabel htmlFor={`optionText${index}`} marginBottom="16px">Option {index}</InputLabel>
          <TextField
            multiline
            label={`Option ${index}`}
            name={`options[${index - 1}].text`}
            placeholder={`Enter Option ${index}`}
            fullWidth
            {...register(`options[${index - 1}].text`, { required: "Option is required" })}
            error={Boolean(errors?.options?.[index - 1]?.text)}
            helperText={errors?.options?.[index - 1]?.text?.message}
          />

          <FormControl fullWidth>
            {/* <InputLabel htmlFor={`correct${index}`} margin="5px 5px 5px 5px">Correct?</InputLabel> */}
            <Controller
              name={`options[${index - 1}].correct`}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Select
                  label={`Correct ${index}`}
                  {...field}
                  error={Boolean(errors?.options?.[index - 1]?.correct)}
                >
                  <MenuItem value={true}>True</MenuItem>
                  <MenuItem value={false}>False</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </div>
      ))}
          <Buttoncomponent
            text={"Create quiz"}
            type={"submit"}
            variant={"contained"}
            style={{ marginTop: 16, backgroundColor: "#00695f" }}
          />
        </form>
      </StyledPaper>
    </CenteredContainer>
  );
};

export default Addquiz;
