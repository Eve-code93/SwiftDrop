import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    alert("You must be logged in to access this page.");
    return <Navigate to="/login" />;
  }

  // If allowedRoles is provided, check if user's role is permitted
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("You are not authorized to access this page.");
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
