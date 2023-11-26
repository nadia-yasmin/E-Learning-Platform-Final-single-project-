import React, { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
} from '@mui/material';

const PostForm = () => {
  const [postContent, setPostContent] = useState('');

  const handlePostSubmit = () => {
    // Handle post submission logic here
    console.log('Post content:', postContent);
    // You can send the postContent to your server or perform other actions
  };

  return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "70vh",
    }}
  >
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h5" component="div" gutterBottom>
          Post Something
        </Typography>
        <form>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            label="Write your post here"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePostSubmit}
          >
            Post
          </Button>
        </form>
      </Paper>
    </Container>
    </div>
  );
};

export default PostForm;
