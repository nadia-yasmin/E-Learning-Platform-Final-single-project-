import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Radio,
  FormControlLabel,
  Snackbar,
  styled,
} from '@mui/material';
import Button from '@mui/material/Button';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledOptionsContainer = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const StyledOptionLabel = styled(FormControlLabel)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const QuizForm = ({ quizData }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOptionChange = (questionId, optionId) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    // Trigger API call to submit quiz with selectedOptions
    // You can replace this with your actual API call logic
    try {
      // Your API call logic here

      // Show success snackbar
      setOpenSnackbar(true);
    } catch (error) {
      // Show error snackbar
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      {quizData.map((question) => (
        <StyledPaper key={question.id}>
          <StyledTypography variant="h6">
            {question.question}
          </StyledTypography>
          <StyledOptionsContainer>
            {question.options.map((option) => (
              <StyledOptionLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
                onChange={() => handleOptionChange(question.id, option.id)}
              />
            ))}
          </StyledOptionsContainer>
        </StyledPaper>
      ))}

      <StyledButton
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Submit
      </StyledButton>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Quiz submitted successfully!"
      />
    </div>
  );
};

export default QuizForm;
// import React,{ useState } from 'react';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import {
//     Paper,
//     Typography,
//     Snackbar,
//     styled,
//     Button
// } from '@mui/material'
// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   marginBottom: theme.spacing(2),
// }));

// const StyledTypography = styled(FormLabel)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
// }));

// const StyledOptionsContainer = styled('div')(({ theme }) => ({
//   marginLeft: theme.spacing(2),
// }));

// const StyledOptionLabel = styled(FormControlLabel)(({ theme }) => ({
//   marginBottom: theme.spacing(1),
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   marginTop: theme.spacing(2),
// }));
// export default function QuizForm({ quizData }) {
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [openSnackbar, setOpenSnackbar] = useState(false);
  
//     const handleOptionChange = (questionId, optionId) => {
//       setSelectedOptions((prevSelectedOptions) => ({
//         ...prevSelectedOptions,
//         [questionId]: optionId,
//       }));
//     };
  
//     const handleSubmit = async () => {
//       // Trigger API call to submit quiz with selectedOptions
//       // You can replace this with your actual API call logic
//       try {
//         // Your API call logic here
  
//         // Show success snackbar
//         setOpenSnackbar(true);
//       } catch (error) {
//         // Show error snackbar
//         setOpenSnackbar(true);
//       }
//     };
  
//     const handleCloseSnackbar = () => {
//       setOpenSnackbar(false);
//     };
  
//     return (
//       <FormControl>
//         {quizData.map((question) => (
//           <StyledPaper key={question.id}>
//             <StyledTypography id="demo-radio-buttons-group-label">
//               {question.question}
//             </StyledTypography>
//             <StyledOptionsContainer>
//               <RadioGroup
//                 aria-labelledby="demo-radio-buttons-group-label"
//                 value={selectedOptions[question.id] || ''}
//                 name={`radio-buttons-group-${question.id}`}
//                 onChange={(event) =>
//                   handleOptionChange(question.id, event.target.value)
//                 }
//               >
//                 {question.options.map((option) => (
//                   <FormControlLabel
//                     key={option.id}
//                     value={option.id}
//                     control={<Radio />}
//                     label={option.text}
//                   />
//                 ))}
//               </RadioGroup>
//             </StyledOptionsContainer>
//           </StyledPaper>
//         ))}
//         <StyledButton
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//         >
//           Submit
//         </StyledButton>
  
//         <Snackbar
//           open={openSnackbar}
//           autoHideDuration={6000}
//           onClose={handleCloseSnackbar}
//           message="Quiz submitted successfully!"
//         />
//       </FormControl>
//     );
// }