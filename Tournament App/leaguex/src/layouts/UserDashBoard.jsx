import SideBar from "../components/SideBar";
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import DashBoardNav from "../components/DashBoardNav";
const UserDashBoard = () => {
    return (
        <main className="bg-slate-900 min-h-screen w-screen flex">
            <SideBar />
            <div className="flex flex-col w-full">
                <DashBoardNav />
                <Outlet />
            </div>
        </main>
    );
}

export default UserDashBoard;