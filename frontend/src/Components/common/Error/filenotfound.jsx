import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const NotFoundContainer = styled('div')({
  width: '100%',
  height: '100vh',
  backgroundColor: '#0a1821',
  fontFamily: 'Roboto, Arial, sans-serif',
  color: '#fff',
  textAlign: 'center',
});

const NotFoundImage = styled('img')({
  width: '560px',
  height: '225px',
  marginRight: '-10px',
});

const NotFoundContent = styled('div')({
  paddingTop: '200px',
  paddingBottom: '200px',
});


const ShowErrorMessage = ({errorMessage}) => {


    return (
      <NotFoundContainer>
        <NotFoundContent>
          <NotFoundImage src="https://miro.medium.com/v2/resize:fit:800/1*hFwwQAW45673VGKrMPE2qQ.png" alt="Not Found Image" />
          <Typography variant="body2">{errorMessage}</Typography>
        </NotFoundContent>
      </NotFoundContainer>
    )
  


};

export default ShowErrorMessage;
