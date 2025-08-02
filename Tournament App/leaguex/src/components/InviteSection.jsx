import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createInvitation } from "../api/invitation";
import { useSelector } from 'react-redux';
const InviteSection = ({ isOpened, setIsOpened, setInvitations }) => {
    const [email, setEmail] = useState("");
    const { teamId } = useSelector(state => state.auth);
    const [createStatus, setCreateStatus] = useState();
    const handleInvite = async () => {
        const response = await createInvitation(email, teamId);
        if (response.status == 201) {
            console.log(response);
            setInvitations(prev => [...prev, response.data]);
            setCreateStatus("Created");
        }
        else {
            setCreateStatus(response.data);
        }
    }
    return (
        <div className="gap-8 absolute top-1/2 p-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl w-full max-w-2xl bg-gray-800 flex flex-col z-20 rounded-lg">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-[1.3rem]">Invite Players</h2>
                <FaTimes onClick={() => setIsOpened(!isOpened)} className="hover:text-red-500 transition duration-100 text-red-500 cursor-pointer text-xl" />
            </div>
            <div>
                <div className="font-bold mb-4">
                    Player Email
                </div>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    type="email"
                    className="w-full mt-2 h-14 border-2 rounded-md py-4 px-4 bg-gray-900 hover:ring-[1px] hover:ring-white outline-none focus:ring-[2px] focus:ring-white"
                    placeholder="Type you email"
                    required />
            </div>
            {
                createStatus === "Created" ?
                    <p className="text-green-500 font-bold">
                        Invitation sent, please wait until player accept
                    </p>
                    :
                    <p className="text-red-500 font-bold">
                        {createStatus}
                    </p>
            }
            <button onClick={handleInvite} className="bg-sky-600 font-semibold p-4 rounded-md hover:bg-sky-500 transition duration-250">Send Invitation</button>
        </div>
    );
}

export default InviteSection;