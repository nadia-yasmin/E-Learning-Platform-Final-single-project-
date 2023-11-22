import * as React from "react";
import Heading4 from "../../form/common/heading/heading4";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import Getallcoursetemplate from "./common/getallcoursetemplate";
const defaultTheme = createTheme();
const DebounceDemo = () => {
  const courseData = useSelector((state) => state.course.courseData);
  console.log("courseData from page", courseData);
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        <Heading4
          text={"Learners are also viewing"}
          variant={"h4"}
          style={{ color: "#00695f", textAlign: "center", fontSize: "1.5rem" }}
        />
        <Getallcoursetemplate
          courseData={courseData}/>
      </main>
    </ThemeProvider>
  );
};
export default DebounceDemo;