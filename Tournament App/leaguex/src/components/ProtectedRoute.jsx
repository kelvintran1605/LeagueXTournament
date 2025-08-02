import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { _id, isAuthChecked, role } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthChecked) {
        return null;
    }

    if (!_id) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    else if (role === "admin") {
        return <Navigate to="/admin-dashboard" state={{ from: location }} replace />
    }

    return children;
};

export default ProtectedRoute;