import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"

const Authenticatelearner= () => {
  const location = useLocation();
  const check = localStorage.getItem("token");

  if (!check) {
    // Token does not exist, redirect to login
    return <Navigate to="/login/learner" />;
  }

  const decodedToken = jwtDecode(check);

  if (!decodedToken || decodedToken.role !== "learner") {
    // Token is invalid or the user is not a learner, redirect to login
    return <Navigate to="/login/learner" />;
  }

  console.log("decodedToken", decodedToken);
  console.log("token", check, "location", location);

  return <Outlet />;
};

export default Authenticatelearner;
