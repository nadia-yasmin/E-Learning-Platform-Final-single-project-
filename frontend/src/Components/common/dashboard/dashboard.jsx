import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems, secondaryListItems } from './listitems';
import { mainListItemsLearner, secondaryListItemsLearner } from './listitemslearner';
import {mainListItemsAdmin,secondaryListItemsAdmin} from './listitemsadmin'
import { Listitemforallmain,Listitemforallsecondary } from './listitemforall';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const userDataString = localStorage.getItem('userdata');
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
    }
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      {userData ? (
        <>
          {userData.role === 'instructor' ? (
            <>
              {mainListItems}
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}
            </>
          ) : userData.role === 'learner' ? (
            <>
              {mainListItemsLearner}
              <Divider sx={{ my: 1 }} />
              {secondaryListItemsLearner}
            </>
          ) : userData.role === 'admin' ? (
            <>
              {mainListItemsAdmin}
              <Divider sx={{ my: 1 }} />
              {secondaryListItemsAdmin}
            </>
          ) : (
            <>
              {Listitemforallmain}
              <Divider sx={{ my: 1 }} />
              {Listitemforallsecondary}
            </>
          )}
        </>
      ) : (
        <>
          {Listitemforallmain}
          <Divider sx={{ my: 1 }} />
          {Listitemforallsecondary}
        </>
      )}
    </>
  );
  
}
