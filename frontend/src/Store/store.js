import { configureStore } from "@reduxjs/toolkit";
import userLogin from "./slices/loginslice";
const store = configureStore({
  reducer: {
    login: userLogin,
  },
});
export default store;
