import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Buttoncomponent from "../../form/common/button/button"
import { TextField, Stack } from "@mui/material";
import usesignuphook from "../../../CustomHooks/useSignuphook"
import { Container, Paper, Avatar, Grid } from "@mui/material";
import Input from "@mui/material/Input";
import { useParams, useNavigate } from "react-router-dom";
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
  height: "90vh",
});
const Editprofile = () => {
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const { role } = useParams();
  const { createPost } = usesignuphook(role);
  const onSubmit = (data) => {
    console.log("data is ", data);
    createPost(data);
  };
  const watchedPassword = watch("password", "");
  return (
    <CenteredContainer>
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
                name="password"
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
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  validate: (value) =>
                    value === watchedPassword || "Both passwords don't match",
                }}
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
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "name is required",
                  validate: (value) => {
                    const names = value.split(" ");
                    const isValid = names.every((name) =>
                      /^[A-Z][a-z]*$/.test(name)
                    );
                    return isValid || "Invalid name format";
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="Name"
                    type="name"
                    placeholder="Enter Name"
                    {...field}
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="file"
                control={control}
                rules={{
                  required: "file is required",
                }}
                defaultValue={[]}
                render={({ field }) => (
                  <Input
                    type="file"
                    name="file"
                    multiple
                    {...field}
                    // accept="image/*"
                    value={field.value.filename}
                    onChange={(event) => {
                      return field.onChange(event.target.files);
                    }}
                    error={Boolean(errors.file)}
                    helperText={errors.file?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Buttoncomponent
            text={"Sign up"}
            type={"submit"}
            variant={"contained"}
            style={{ marginTop: 16, backgroundColor: "#00695f" }}
          />
        </form>
      </StyledPaper>
    </CenteredContainer>
  );
};

export default Editprofile;
