import { HiUserGroup } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { AiOutlinePlus } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const NoTeam = () => {
    const navigate = useNavigate();
    return (
        <div className="text-[1.2rem] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-6 flex-col text-white justify-center items-center">
            <div className="rounded-full bg-gray-700 w-[8rem] h-[8rem] flex justify-center items-center pb-2">
                <HiUserGroup className="text-[5rem]" />
            </div>
            <h1 className="font-bold text-[1.5rem]">No Teams Yet</h1>
            <p className="text-center text-gray-400">You haven't joined any teams yet. Start collaborating by creating your own team or accepting an invitation from colleagues</p>
            <div className="flex gap-3">
                <button onClick={() => navigate("/create-team")} className="p-2 hover:bg-gray-300 rounded-md bg-white flex gap-2 items-center text-black ">
                    <AiOutlinePlus />Create Team
                </button>
                <button onClick={() => navigate("/user-dashboard/browse-team")} className="p-2 hover:bg-gray-600 rounded-md flex gap-2 items-center border-[1px] border-white">
                    <FaSearch />Browse Teams
                </button>
            </div>
            <p>Need help getting started?</p>
            <Link><p className="underline">Learn more about teams and collaboration</p></Link>
        </div>
    );
}

export default NoTeam;