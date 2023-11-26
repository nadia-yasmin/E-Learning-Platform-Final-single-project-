import React, { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import axiosInstance from "../../../Utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuizComponent = ({ quizData, quizId }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const learnerId = JSON.parse(localStorage.getItem("userdata"))._id;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000, // Auto-close the toast after 5000 milliseconds (5 seconds)
    });
  };

  const showFailureToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
  };
  const postData = async (data) => {
    try {
      const response = await axiosInstance.post(
        `/attemptquiz?quizId=${quizId}`,
        data
      );
      console.log("New answer added", response);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error adding course data:", error);
      throw error;
    }
  };

  const submitQuiz = async (learnerId) => {
    try {
      const response = await axiosInstance.post("/submitquiz", {
        learnerId,
        quizId,
      });
      console.log("Quiz submitted", response);
      toast(`Your mark is ${response.data.feedback.score}`);
      console.log("toast", response.data.feedback.score);
      // toast('submitted')
      return response;
    } catch (error) {
      toast.error(error.response);
      console.error("Error submitting quiz:", error);
      throw error;
    }
  };



  useEffect(() => {
    const submitAnswer = async () => {
      try {
        const answers = Object.entries(selectedOptions).map(
          ([questionId, selectedOption]) => ({
            learnerId: learnerId,
            answer: {
              questionId: questionId,
              selectedOptionId: selectedOption,
            },
          })
        );
        await Promise.all(answers.map((answer) => postData(answer)));
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    submitAnswer(); // Call the function when the dependencies change
  }, [selectedOptions]);

  const handleOptionChange = (questionId, optionId) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    setOpenSnackbar(true);
    // Call the function to submit the entire quiz
    submitQuiz(learnerId);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ToastContainer />
      <FormControl style={{ marginBottom: "160px" }}>
        {quizData.map((question) => (
          <div key={question._id}>
            <FormLabel>{question.question}</FormLabel>
            <RadioGroup
              name={`radio-buttons-group-${question._id}`}
              value={selectedOptions[question._id] || ""}
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

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="Quiz submitted successfully!"
        />
      </FormControl>
    </div>
  );
};

export default QuizComponent;
