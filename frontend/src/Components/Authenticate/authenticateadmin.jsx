import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
const Authenticateadmin= () => {
  const location = useLocation();
  const check = localStorage.getItem("token");

  if (!check) {
    // Token does not exist, redirect to login
    return <Navigate to="/login/admin" />;
  }

  const decodedToken = jwtDecode(check);

  if (!decodedToken || decodedToken.role !== "admin") {
    // Token is invalid or the user is not a learner, redirect to login
    return <Navigate to="/login/admin" />;
  }

  console.log("decodedToken", decodedToken);
  console.log("token", check, "location", location);

  return <Outlet />;
};

export default Authenticateadmin;
