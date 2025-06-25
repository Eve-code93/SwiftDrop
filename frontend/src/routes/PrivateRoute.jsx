import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    alert("You must be logged in to access this page.");
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
