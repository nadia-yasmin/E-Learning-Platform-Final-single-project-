import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import SchoolIcon from "@mui/icons-material/School";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import { Link } from "react-router-dom";
const StyledItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#C6EDDB",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

function FormRow() {
  return (
    <React.Fragment>
      <Grid item xs={4}>
        <Link to="/signup/admin">
          <StyledItem>
            <AdminPanelSettingsIcon fontSize="large" />{" "}
            <span style={{ marginTop: "8px" }}>Sign up as Admin</span>
          </StyledItem>
        </Link>
      </Grid>
      <Grid item xs={4}>
        <Link to="/signup/instructor">
          <StyledItem>
            <CastForEducationIcon fontSize="large" />{" "}
            <span style={{ marginTop: "8px" }}>Sign up instructor</span>
          </StyledItem>
        </Link>
      </Grid>
      <Grid item xs={4}>
        <Link to="/signup/learner">
          <StyledItem>
            <SchoolIcon fontSize="large" /> {/* Adjust the size as needed */}
            <span style={{ marginTop: "8px" }}>Sign up as Learner</span>
          </StyledItem>
        </Link>
      </Grid>
    </React.Fragment>
  );
}

const Signupoptions = () => {
  return (
    <Box sx={{ flexGrow: 1, marginTop: "150px" }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <FormRow />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Signupoptions;
