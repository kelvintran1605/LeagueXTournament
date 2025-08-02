import { useEffect, useState } from "react";
import DashBoardNav from "../components/DashBoardNav";
import { deleteUser, getAllUsers } from "../api/user";
import { getTeams } from "../api/team";
import { createAdmin } from "../api/user";
import CreateTournament from "./CreateTournament";
import { getAllTournaments } from "../api/tournament.js";
import BrowseTournament from "./BrowseTournament.jsx";
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("user");
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [adminOpenMode, setAdminOpenMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [tournaments, setTournaments] = useState([]);
    const [adminForm, setAdminForm] = useState({
        adminName: "",
        email: "",
        password: "",
        confirmedPassword: ""
    })
    const handleDeleteUser = async (userId) => {
        const message = await deleteUser(userId);
        setUsers(prev => prev.filter(user => user._id !== userId));
        alert(message);
    }

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        if (adminForm.password !== adminForm.confirmedPassword) {
            setErrorMessage("Confirmed Password does not match");
            return;
        }
        else if (Object.values(adminForm).some(value => !value)) {
            setErrorMessage("Fields cannot be empty");
            return;
        }

        const admin = await createAdmin(adminForm.adminName, adminForm.email, adminForm.password);
        console.log(admin);
        if (admin && admin._id) {
            alert("Created admin successfully");
            setUsers([...users, admin]);
            setAdminOpenMode(false);
            setAdminForm({
                adminName: "",
                email: "",
                password: "",
                confirmedPassword: ""
            });
            setErrorMessage("");
        } else {
            console.log(admin?.error);
        }

    }

    useEffect(() => {

        const getUsers = async () => {
            const users = await getAllUsers();
            setUsers(users);
        }

        const getAllTeams = async () => {
            const teams = await getTeams();
            setTeams(teams);
        }

        const getTournaments = async () => {
            const tournaments = await getAllTournaments();
            setTournaments(tournaments);
        }

        getTournaments();
        getUsers();
        getAllTeams();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white px-8 py-6   ">
            <DashBoardNav />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl">
                    <p className="text-gray-400">Total Users</p>
                    <p className="text-3xl font-semibold">{users.length}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl">
                    <p className="text-gray-400">Total Teams</p>
                    <p className="text-3xl font-semibold">{teams.length}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl">
                    <p className="text-gray-400">Total Tournaments</p>
                    <p className="text-3xl font-semibold">{tournaments.length}</p>
                </div>
            </div>

            {/* Create admin button */}
            <button onClick={() => setAdminOpenMode(true)} className="bg-blue-600 text-white p-2 mb-6 font-bold rounded-lg text-base hover:bg-blue-700 transition">
                Create admin account
            </button>

            {/* Admin input box */}
            {adminOpenMode &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Create New Admin Account</h2>
                        <form onSubmit={handleCreateAdmin}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Admin Name</label>
                                <input onChange={(e) => setAdminForm({ ...adminForm, adminName: e.target.value })} value={adminForm.adminName} type="text" className="text-gray-800 mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Email</label>
                                <input onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} value={adminForm.email} type="email" className="text-gray-800 mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Password</label>
                                <input onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} value={adminForm.password} type="password" className="text-gray-800 mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Confirm Password</label>
                                <input onChange={(e) => setAdminForm({ ...adminForm, confirmedPassword: e.target.value })} value={adminForm.confirmedPassword} type="password" className="text-gray-800 mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            {errorMessage && <p className="text-red-400">{errorMessage}</p>}
                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => setAdminOpenMode(false)} type="button" className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            }

            {/* Tabs */}
            <div className="flex space-x-6 border-b border-gray-700 mb-4">
                {['User Management', 'Tournament Management'].map((tab, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                        className={`pb-2 ${activeTab === tab.toLowerCase().split(' ')[0] ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'} hover:font-bold`}
                    >
                        {tab}
                    </button>
                ))}
            </div>


            {/* User Table */}
            {activeTab === "user" && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-800 text-gray-400">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Position</th>
                                <th className="px-4 py-3">Gender</th>
                                <th className="px-4 py-3">Team Name</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users?.map((user, idx) => (
                                <tr key={idx} className="hover:bg-gray-800">
                                    <td className="px-4 py-3">{user.name}</td>
                                    <td className="px-4 py-3 text-gray-300">{user.email}</td>
                                    <td className="px-4 py-3 text-gray-300">{user.location || "None"}</td>
                                    <td className={` px-4 py-3 text-gray-300`}>{user.position || "None"}</td>
                                    <td className={` px-4 py-3 text-gray-300`}>{user.gender || "None"}</td>
                                    <td className="px-4 py-3 text-gray-300">{user.teamId?.name || "None "}</td>
                                    <td className="px-4 py-3">
                                        <span className={user.role === 'admin' ? 'text-blue-400 font-medium' : ''}>{user.role}</span>
                                    </td>
                                    <td>
                                        {user.role === "user" &&
                                            <button onClick={() => handleDeleteUser(user._id)} className="bg-red-700 px-3 py-1 rounded hover:bg-red-600 m-2">Delete</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab === "team" && <p className="text-gray-400">Team Management content goes here...</p>}
            {activeTab === "tournament" && <BrowseTournament />}
        </div>
    );
}
