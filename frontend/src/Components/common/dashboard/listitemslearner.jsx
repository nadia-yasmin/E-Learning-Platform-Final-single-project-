import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import GroupIcon from "@mui/icons-material/Group";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import PercentIcon from "@mui/icons-material/Percent";
import ShopIcon from "@mui/icons-material/Shop";
const userData = JSON.parse(localStorage.getItem("userdata"));
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

export const mainListItemsLearner = (
  <>
    <MainListItem
      icon={<ScreenSearchDesktopIcon />}
      text="Browse Courses"
      to="/"
    />
    <MainListItem icon={<PersonOutlineIcon />} text="Profile" to="/profile" />
    <MainListItem
      icon={<ShopIcon />}
      text="My courses"
      to="/getsubscribedcourses"
    />

  </>
);

export const secondaryListItemsLearner = (
  <>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>

{userData && (
  <MainListItem
    icon={<ShoppingCartIcon />}
    text="Cart"
    to={`/viewcart/${userData._id}`}
  />
)}

    <MainListItem
      icon={<FavoriteBorderIcon />}
      text="Wishlist"
      to="/viewwishlist"
    />
    <MainListItem icon={<PercentIcon />} text="Progress" to="/quizmarks" />
  </>
);
