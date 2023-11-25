import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Heading4 = ({ text, variant, style }) => {
  return (
    <Box sx={{ width: "100%", marginLeft: "30px" }}>
      <Typography variant={variant} gutterBottom style={style}>
        {text}
      </Typography>
    </Box>
  );
};
export default Heading4;
