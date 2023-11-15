import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Buttoncomponent from "./common/button/button";
import { TextField, Stack } from "@mui/material";
import usesignuphook from "../../CustomHooks/useSignuphook";
import { Container, Paper, Avatar, Grid } from "@mui/material";
import Input from "@mui/material/Input";
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
  height: "90vh",
});
const Adminsignup = () => {
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const { createPost } = usesignuphook("admin");
  const onSubmit = (data) => {
    console.log(data);
    console.log("data.file[0].name", data.file[0].name);

    console.log("data.file[0].size", data.file[0].size);
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
                name="email"
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
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
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
                render={({ field }) => (
                  <Input
                    type="file"
                    accept="image/*"
                    {...field}
                    error={Boolean(errors.file)}
                    helperText={errors.file?.message}
                  />
                  //   <input type="file" />
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

export default Adminsignup;
