import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { acceptRequest, declineRequest } from "../api/request";
import { useSelector } from 'react-redux';
import { cancelInvitation } from "../api/invitation";

const RequestsSection = ({ isOpened, setIsOpened, userRequests, setTeam, setUserRequests, invitations, setInvitations, team }) => {
    const { teamId } = useSelector(state => state.auth);
    // Get the section
    const [section, setSection] = useState("Invitations");

    const handleAccept = async (teamId, userId, name, position, email, profileImage) => {
        const response = await acceptRequest(teamId, userId);
        setTeam(prev => ({ ...prev, playerIds: [...prev.playerIds, { _id: userId, name, position, email }] }));
        setUserRequests(prev =>
            prev.filter(req => req.userId._id !== userId)
        );
        console.log(team.playerIds);
        console.log(userRequests);
    }

    const handleCancel = async (userId, teamId) => {
        const status = await cancelInvitation(userId, teamId);
        if (status === 200) {
            const updatedInvitations = invitations.filter(invitation => invitation?.userId?._id !== userId);
            setInvitations(updatedInvitations);
        }
        else {
            console.log("deleted failed")
        }
    }

    const handleDecline = async (userId, teamId) => {
        const status = await declineRequest(userId, teamId);
        if (status === 200) {
            const updatedRequests = userRequests.filter(request => request.userId._id !== userId);
            setUserRequests(updatedRequests);
        }
        else {
            alert(status);
        }
    }
    return (
        <div className="z-10 gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl w-full max-w-2xl bg-gray-800 flex flex-col p-4 rounded-lg h-[40rem]">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-[1.3rem]">Team Requests</h2>
                <FaTimes onClick={() => setIsOpened(!isOpened)} className="hover:text-red-500 transition duration-100 text-red-500 cursor-pointer text-xl" />
            </div>

            <div className="flex justify-around">
                <h3 onClick={() => { setSection("Invitations") }} className={`hover:bg-gray-700 ${section === "Invitations" && "bg-gray-600"} w-full text-center hover:cursor-pointer p-2 rounded-md transition duration-250`}>
                    Invitations Sent
                </h3>
                <h3 onClick={() => { setSection("Requests") }} className={`hover:bg-gray-700 ${section === "Requests" && "bg-gray-600"} w-full text-center hover:cursor-pointer p-2 rounded-md transition duration-250`}>
                    Join Requests
                </h3>
            </div>
            <div className="h-full flex flex-col gap-4 overflow-y-scroll">
                {
                    section === "Invitations" ?
                        invitations?.filter(invitation => invitation.status === "pending").map(invitation => (
                            <div className="flex justify-between items-center p-8 bg-black bg-opacity-15">
                                <div className="flex gap-4">
                                    <img className="w-[3rem] h-[3rem] rounded-full object-contain" src="/images/soccer-player-icon.png" />
                                    <div>
                                        <p className="font-bold">{invitation.userId.name}</p>
                                        <p>Pending</p>
                                    </div>
                                </div>
                                <button onClick={() => handleCancel(invitation.userId._id, teamId)} className="p-2 rounded-md hover:bg-gray-600 transition duration-250 bg-gray-700">
                                    Cancel Invitation
                                </button>
                            </div>
                        )) :
                        userRequests
                            .filter(request => request.status === "pending")
                            .map(request => (
                                <div key={request._id} className="flex justify-between items-center p-8 bg-black bg-opacity-15">
                                    <div className="flex gap-4">
                                        <img className="w-[3rem] h-[3rem] rounded-full object-cover" src={request?.userId?.profileImage?.url || "/images/soccer-player-icon.png"} />
                                        <div>
                                            <p className="font-bold">{request.userId.name}</p>
                                            <p className="text-sky-500">{request.userId.position}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => handleAccept(teamId, request.userId._id, request.userId.name, request.userId.position, request.userId.email, request.userId.profileImage)} className="p-2 rounded-md hover:bg-green-600 transition duration-250 bg-green-700 px-8">
                                            Accept
                                        </button>
                                        <button onClick={() => handleDecline(request.userId._id, teamId)} className="p-2 rounded-md hover:bg-red-600 transition duration-250 bg-red-700 px-8">
                                            Decline
                                        </button>
                                    </div>
                                </div>))
                }
            </div>


        </div >
    );
}

export default RequestsSection;