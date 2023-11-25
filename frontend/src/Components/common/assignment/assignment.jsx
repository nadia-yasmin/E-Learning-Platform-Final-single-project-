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
const Assignment = ({ lessonData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);
  };
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <Typography variant="h5" gutterBottom>
          Assignment
        </Typography>
        <Imagecomponent lessonData={lessonData} />
        <Typography variant="h5" gutterBottom>
          {lessonData.assignment.text}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form
        // onSubmit={handleSubmit(onSubmit)}
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
                multiple
                onChange={(event) => field.onChange(event.target.files)}
                error={Boolean(errors.file)}
                helperText={errors.file?.message}
              />
            )}
          />
          <Buttoncomponent
            text={"Submit"}
            type={"submit"}
            variant={"contained"}
            style={{ marginTop: 16, backgroundColor: "#00695f" }}
          />
        </form>
      </Grid>
    </Grid>
  );
};

export default Assignment;
