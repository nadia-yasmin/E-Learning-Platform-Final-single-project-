import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { styled } from "@mui/system";

const StyledList = styled(List)({
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  padding: "16px",
});

const StyledListItemButton = styled(ListItemButton)({
  "&:hover": {
    backgroundColor: "#e0e0e0",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
  },
  border: "1px solid #ddd",
  marginBottom: "8px",
});

const AccordionItem = ({ index, expanded, onChange, fetchData, lessonData,courseId }) => (
  <Accordion key={index} expanded={expanded === `panel${index}`} onChange={onChange(`panel${index}`)}>
    <AccordionSummary
      onClick={() => fetchData(index + 1, courseId)}
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`panel${index}bh-content`}
      id={`panel${index}bh-header`}
    >
      <Typography sx={{ width: "33%", flexShrink: 0 }}>
        Week {index + 1}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <nav aria-label="secondary mailbox folders">
        <StyledList>
          {lessonData.map((lesson, lessonIndex) => (
            <ListItem key={lessonIndex} disablePadding>
              <StyledListItemButton
                component={Link}
                to={`/lessons/${lesson._id}`}
              >
                <ListItemText primary={lesson.title} />
              </StyledListItemButton>
            </ListItem>
          ))}
        </StyledList>
      </nav>
    </AccordionDetails>
  </Accordion>
);

export default AccordionItem;
