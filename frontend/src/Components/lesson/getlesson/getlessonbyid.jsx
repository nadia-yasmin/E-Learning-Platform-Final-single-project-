import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import ReactPlayer from "react-player";
import useviewcoursehook from "../../../CustomHooks/useviewcoursehook";
import useviewlessonhook from "../../../CustomHooks/useviewlessonhook";
import { useParams, useNavigate, Link } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import axiosInstance from "../../../Utils/axiosInstance";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { styled } from "@mui/system";

import "../../../App.css";

const Viewlesson = () => {
  const { lessonId } = useParams();
  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: "white",
  }));
  const [lessonData, setLessonData] = useState([]);
  const StyledList = styled(List)({
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "16px",
  });
  const StyledListItemButton = styled(ListItemButton)({
    "&:hover": {
      backgroundColor: "#e0e0e0",
      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    },
    border: "1px solid #ddd",
    marginBottom: "8px",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/showlessonbyid?lessonId=${lessonId}`
        );
        console.log("SINGLE LESSON RESPONSE", response);
        setLessonData(response.data.lesson);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [lessonId]);
  console.log("lessonData", lessonData);

  // if (loading) {
  //   return (
  //     <Container>
  //       <Skeleton variant="rectangular" height={200} />
  //       <Skeleton height={20} width="80%" />
  //       <Skeleton height={20} width="50%" />
  //     </Container>
  //   );
  // }

  return <div>hello</div>;
};
export default Viewlesson;
