import axios from "axios"

export const createInvitation = async (email, teamId) => {
    try {
        const response = await axios.post("http://localhost:8000/invitations", { email, teamId }, { withCredentials: true });
        return response;
    } catch (err) {
        console.log(err.message);
        return err.response;
    }
}

export const getAllInvitationsByUserId = async () => {
    try {
        const response = await axios.get("http://localhost:8000/invitations", { withCredentials: true });
        const requestedInvitation = response.data;
        console.log(requestedInvitation);
        return requestedInvitation;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}

export const acceptInvitation = async (teamId) => {
    try {
        const response = await axios.put("http://localhost:8000/invitations/accept", { teamId }, { withCredentials: true });
        return response.status;
    }
    catch (err) {
        if (err.response) {
            return err.response.status;
            console.error("Server responded:", err.response.data);
        }
    }
}

export const getAllInvitationsByTeamId = async (teamId) => {
    try {
        const response = await axios.get(`http://localhost:8000/invitations/${teamId}`, { withCredentials: true });
        const invitations = response.data;
        return invitations;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}

export const cancelInvitation = async (userId, teamId) => {
    try {
        const response = await axios.delete("http://localhost:8000/invitations/cancel", { data: { userId, teamId }, withCredentials: true });
        return response.status;
    }
    catch (err) {
        console.log(err.response.data);
    }
}

export const declineInvitation = async (teamId) => {
    try {
        const response = await axios.delete("http://localhost:8000/invitations/decline", { data: { teamId }, withCredentials: true });
        return response.status;
    }
    catch (err) {
        console.log(err);
        return err.response?.data || { message: "Unknown error" };
    }
}