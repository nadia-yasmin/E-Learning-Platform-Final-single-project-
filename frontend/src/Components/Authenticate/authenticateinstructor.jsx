import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
const Authenticateinstructor= () => {
  const location = useLocation();
  const check = localStorage.getItem("token");

  if (!check) {
    // Token does not exist, redirect to login
    return <Navigate to="/login/instructor" />;
  }

  const decodedToken = jwtDecode(check);

  if (!decodedToken || decodedToken.role !== "instructor") {
    // Token is invalid or the user is not a learner, redirect to login
    return <Navigate to="/login/instructor" />;
  }

  console.log("decodedToken", decodedToken);
  console.log("token", check, "location", location);

  return <Outlet />;
};

export default Authenticateinstructor;
