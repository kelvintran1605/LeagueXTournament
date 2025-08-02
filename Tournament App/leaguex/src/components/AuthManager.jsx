import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { login, logout } from "../store/auth-slice";
import { useSelector } from "react-redux";
const AuthManager = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { skipAuthCheck, role } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (role === "admin") navigate("admin-dashboard");

        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:8000/users/profile", {
                    withCredentials: true,
                });

                const user = response.data.user;

                dispatch(login({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    position: user.position,
                    gender: user.gender,
                    location: user.location,
                    teamId: user.teamId,
                    profileImageUrl: user.profileImage?.url,
                    role: user.role
                }));
            } catch {
                dispatch(logout());
            }
        };

        checkAuth();
    }, [location.pathname]);

    return null;
};

export default AuthManager;
