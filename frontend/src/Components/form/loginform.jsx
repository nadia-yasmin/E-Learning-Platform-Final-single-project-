import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Heading4 from "./common/heading/heading4";
import Buttoncomponent from "./common/button/button";
import { TextField, Stack } from "@mui/material";
import useLoginHook from "../../CustomHooks/useloginhook";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const { createLogin } = useLoginHook();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPasword(e.target.value);
  };

  const onSubmit = (data) => {
    createLogin(data);
  };

  return (
    <>
      <Heading4 text={"Login"} variant={"h4"} />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} width={400}>
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
                value={email}
                onChange={(e) => {
                  handleEmailChange(e);
                  field.onChange(e);
                }}
                style={{ border: errors.email ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.email && (
            <Heading4 text={errors.email.message} variant={"h6"} />
          )}
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              // Add your password validation rules here
            }}
            render={({ field }) => (
              <TextField
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  handlePasswordChange(e);
                  field.onChange(e);
                }}
                style={{ border: errors.password ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.password && (
            <Heading4 text={errors.password.message} variant={"h6"} />
          )}
          <Buttoncomponent
            text={"Login"}
            type={"submit"}
            variant={"contained"}
            color={"primary"}
          />
        </Stack>
      </form>
    </>
  );
};

export default Login;
