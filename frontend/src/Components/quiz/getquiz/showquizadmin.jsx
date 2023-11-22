// import toast from "react-toastify"
import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axiosInstance";
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import "sweetalert2/dist/sweetalert2.css";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import {Grid} from '@mui/material'

const Showquizadmin = () => {
  const { lessonId } = useParams();
  const [quizData, setQuizData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/showquizbylesson?lessonId=${lessonId}`);
        console.log("Show quiz", response.data.quiz.quiz);
        setQuizData(response.data.quiz.quiz);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [lessonId]);

  const handleOptionChange = (questionId, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]: value,
    }));
  };

  return (
    <Container>
      {quizData.length === 0 ? (
      <Typography variant="h6" gutterBottom>
      No quiz to show. <Link to={`/createquiz/${lessonId}`}>Create quiz?</Link>
    </Typography>
      ) : (
        <div>
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12}>
      <FormControl style={{ marginBottom: '160px' }}>
        {quizData.map((question) => (
          <div key={question._id}>
            <FormLabel>{question.question}</FormLabel>
            <RadioGroup
              name={`radio-buttons-group-${question._id}`}
              value={selectedOptions[question._id] || ''}
              onChange={(event) =>
                handleOptionChange(question._id, event.target.value)
              }
            >
              {question.options.map((option) => (
                <FormControlLabel
                  key={option._id}
                  value={option._id}
                  control={<Radio />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
          </div>
        ))}
      </FormControl>
    </Grid>
    <Grid item xs={12}>
      <Link to={`/addquiz/${lessonId}`}>Add more quiz questions..</Link>
    </Grid>
  </Grid>
</div>
      )}
    </Container>
  );
};

export default Showquizadmin;
