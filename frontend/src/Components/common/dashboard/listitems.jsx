import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';

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
    <MainListItem icon={<DashboardIcon />} text="Dashboard" to="/" />
    <MainListItem icon={<DashboardIcon />} text="Profile" to="/profile" />
    <MainListItem icon={<DashboardIcon />} text="Categories" to="/categories" />
    <MainListItem icon={<ShoppingCartIcon />} text="Courses" to="/courses" />
    <MainListItem icon={<PeopleIcon />} text="Lessons" to="/lessons" />
    <MainListItem icon={<BarChartIcon />} text="Learners" to="/learners" />
  </>
);

export const secondaryListItems = (
  <>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <MainListItem icon={<AssignmentIcon />} text="Discussion" to="/discussion" />
    <MainListItem icon={<AssignmentIcon />} text="Subscription" to="/subscription" />
    <MainListItem icon={<AssignmentIcon />} text="Transactions" to="/transactions" />
  </>
);
