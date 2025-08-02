import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { logout } from '../store/auth-slice';
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
const DashBoardNav = () => {
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    const { isLoggedIn, name, email, _id, profileImageUrl } = auth;
    const dispatch = useDispatch();
    const [isOpened, setIsOpened] = useState(false);

    const navContent = [
        {
            path: "/user-dashboard/browse-team",
            title: "Browse Teams",
            description: "Find and join professional soccer teams"
        },
        {
            path: "/user-dashboard/team",
            title: "My Team",
            description: "Manage your squad, roles, and performance"
        },
        {
            path: "/user-dashboard/matches",
            title: "Matches",
            description: "View upcoming games and match history"
        },
        {
            path: "/user-dashboard/tournaments",
            title: "Tournaments",
            description: "Compete in and track tournament standings"
        },
        {
            path: "/user-dashboard/profile",
            title: "Profile",
            description: "Update your personal info and preferences"
        },
        {
            path: "/user-dashboard/setting",
            title: "Settings",
            description: "Configure your account and app preferences"
        },
        {
            path: "/admin-dashboard",
            title: "Admin Dashboard",
            description: "Welcome back, here's a summary of LeagueX."
        }
    ];

    const handleLogOut = async () => {
        try {
            const response = await axios.post("http://localhost:8000/users/logout", null, { withCredentials: true });
            const message = response.data.message;
            console.log(message);
            alert(message);
            setIsOpened(false);
            dispatch(logout());
            navigate("/");
        }
        catch (error) {
            console.log(error.response.data.message);
        }
    }
    // Get the current path
    const location = useLocation();

    // Find nav content to display matching each path
    const current = navContent.find(content => content.path === location.pathname);

    // function to get avatar
    const initials = name
        ? name
            .split(" ")
            .map(part => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "U";
    return (
        <div className="flex relative items-center justify-between w-full px-8 mt-8 text-white mb-6">
            <div>
                <h1 className="font-bold text-[1.3rem]">{current?.title}</h1>
                <p className="text-gray-300">{current?.description}</p>
            </div>
            <div className={`${isOpened ? "flex" : "hidden"} shadow-2xl backdrop-blur-md bg-white/90 flex-col absolute top-full right-10 rounded-md z-40 text-[#17284D] gap-4 py-7 w-[17rem]`}>
                <h2 className="text-[#626F86] font-bold ml-4">Account</h2>
                <div className="text-[14px] ml-10">
                    <div>{name}</div>
                    <div className="text-[#44546F]">{email}</div>
                </div>
                <hr />
                <button onClick={handleLogOut} className="hover:bg-gray-300 transition duration-250 h-[3rem] px-7 text-left">Log Out</button>
            </div>
            <div
                onClick={() => setIsOpened(!isOpened)}
                className="w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 border-white"
            >
                <img
                    src={profileImageUrl || "/images/soccer-player-icon.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}

export default DashBoardNav;