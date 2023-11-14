import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Heading4 = ({ text, variant }) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Typography variant={variant} gutterBottom>
        {text}
      </Typography>
    </Box>
  );
};
export default Heading4;
