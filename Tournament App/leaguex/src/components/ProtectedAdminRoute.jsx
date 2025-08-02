import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
    const { _id, isAuthChecked, role } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthChecked) {
        return <div className="text-red-500 text-center">Loading...</div>;
    }
    if (!_id || role !== "admin") {
        return <Navigate to="/user-dashboard/team" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedAdminRoute;