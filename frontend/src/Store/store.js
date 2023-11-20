import { configureStore } from "@reduxjs/toolkit";
import userLogin from "./slices/loginslice";
import courseSearch from "./slices/searchcourse";
const store = configureStore({
  reducer: {
    login: userLogin,
    course: courseSearch,
  },
});
export default store;