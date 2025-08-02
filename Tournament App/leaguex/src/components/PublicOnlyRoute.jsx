import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
    const { _id, isAuthChecked } = useSelector(state => state.auth);
    const location = useLocation();
    if (!isAuthChecked) {
        return null;
    }

    if (_id) {
        return <Navigate to="/user-dashboard/browse-team" state={{ from: location }} replace />
    }

    return children;
}

export default PublicOnlyRoute;