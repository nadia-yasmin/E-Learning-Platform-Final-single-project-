import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';
import ViewListIcon from '@mui/icons-material/ViewList';
import CategoryIcon from '@mui/icons-material/Category';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
const MainListItem = ({ icon, text, to }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(to);
  };

  return (
    <ListItemButton onClick={handleButtonClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export const mainListItems = (
  <>
    <MainListItem icon={<ScreenSearchDesktopIcon />} text="Browse Courses" to="/" />
    <MainListItem icon={<PersonOutlineIcon />} text="Profile" to="/profile" />
    <MainListItem icon={<CategoryIcon />} text="Categories" to="/categories" />
    <MainListItem icon={<ViewListIcon />} text="Courses CRUD" to="/courses" />
    <MainListItem icon={<GroupIcon />} text="My Students" to="/learners" />
  </>
);

export const secondaryListItems = (
  <>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <MainListItem icon={<SubscriptionsIcon />} text="Subscription" to="/subscription" />
  </>
);
