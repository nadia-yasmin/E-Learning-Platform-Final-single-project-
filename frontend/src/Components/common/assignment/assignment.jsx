import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Radio,
  FormControlLabel,
  Snackbar,
  styled,
  Grid
} from '@mui/material';
import Imagecomponent from '../image/image';
import Buttoncomponent from '../../form/common/button/button';
const Assignment = ({ lessonData }) => {
    return(
    <Grid container justifyContent="center">
    <Grid item xs={12} md={8}>
      <Typography variant="h5" gutterBottom>
        Assignment
      </Typography>
      {/* {loading && <LinearColor />} */}
      <Imagecomponent lessonData={lessonData}/>
      <Typography variant="h5" gutterBottom>{lessonData.assignment.text}</Typography>
    </Grid>
    <Buttoncomponent
            text={"Submit"}
            type={"submit"}
            variant={"contained"}
            style={{ marginTop: 16, backgroundColor: "#00695f" }}
          />
  </Grid>

    )
};

export default Assignment;
