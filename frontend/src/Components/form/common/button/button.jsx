import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

const Buttoncomponent = ({ text, type, variant, color ,style,backgroundColor}) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Button type={type} variant={variant} style={style} backgroundColor={backgroundColor}>
        {text}
      </Button>
    </Box>
  );
};
export default Buttoncomponent;
