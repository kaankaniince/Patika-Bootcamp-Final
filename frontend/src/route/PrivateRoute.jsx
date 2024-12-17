import { Navigate } from "react-router-dom";
import { useAuth } from "../Store/AuthContext";

function PrivateRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />; // Redirect unauthorized users to home or error page
  }

  return children;
}

export default PrivateRoute;
