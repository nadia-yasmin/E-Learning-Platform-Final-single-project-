import React from "react";
import Container from "@mui/material/Container";
import ReactPlayer from "react-player";

const VideoContainer = ({ width, height, url, playing, muted, controls }) => {
  return (
    <Container maxWidth="md" className="playerDiv" style={{ margin: "0 auto "}}>
      <ReactPlayer
        width={width}
        height={height}
        url={url}
        playing={playing}
        muted={muted}
        controls={controls}
      />
    </Container>
  );
};

export default VideoContainer;
