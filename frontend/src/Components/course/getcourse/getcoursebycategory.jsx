import React,{useState,useEffect} from "react";
import Heading4 from "../../form/common/heading/heading4";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate,useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axiosInstance";
import Getallcoursetemplate from "./common/getallcoursetemplate";
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const defaultTheme = createTheme();

const Getallcoursebycategory = () => {
const {categoryId}=useParams()
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/getbycategoryid?categoryId=${categoryId}`);
        setCourseData(response.data.courses);
        console.log("Category response", response.data.courses);
      } catch (error) {
        console.error("Error fetching data:", error);
        showErrorAlert(error.message)
      }
    };
    fetchData();
  }, []);
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
  courseData={courseData}
/>
      </main>
    </ThemeProvider>
  );
};

export default Getallcoursebycategory;
