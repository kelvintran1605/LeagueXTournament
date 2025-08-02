import axios from "axios"

export const createRequest = async (teamId) => {
    try {
        const response = await axios.post(`http://localhost:8000/requests/${teamId}`, {}, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export const getAllRequestsByUserId = async () => {
    try {
        const response = await axios.get("http://localhost:8000/requests", { withCredentials: true });
        const requestedTeam = response.data;
        return requestedTeam;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}

export const deleteRequest = async (teamId) => {
    try {
        const response = await axios.delete(`http://localhost:8000/requests/${teamId}`, { withCredentials: true });
        if (response.status === 200) {
            return true;
        }
    }
    catch (err) {
        console.log(err);
    }
}

export const getAllRequestsByTeamId = async (teamId) => {
    try {
        const response = await axios.get(`http://localhost:8000/requests/${teamId}`, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}

export const acceptRequest = async (teamId, userId) => {
    try {
        const response = await axios.put("http://localhost:8000/requests/accept", { userId, teamId }, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        if (err.response) {
            console.error("Server responded:", err.response.data);
        }
    }
}

export const declineRequest = async (userId, teamId) => {
    try {
        const response = await axios.delete("http://localhost:8000/requests/decline", { data: { userId, teamId }, withCredentials: true });
        return response.status;
    }
    catch (err) {
        console.log(err);
        return err.response?.data || { message: "Unknown error" };
    }
}
