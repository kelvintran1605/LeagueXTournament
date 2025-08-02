import axios from 'axios';

export const createTournament = async (name, description, location, field, roundStartDates) => {
    try {
        const response = await axios.post("http://localhost:8000/tournaments",
            {
                name,
                description,
                location,
                field,
                roundStartDates
            }, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export const getAllTournaments = async () => {
    try {
        const response = await axios.get("http://localhost:8000/tournaments", { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export const deleteTournament = async (tournamentId) => {
    try {
        const response = await axios.delete(`http://localhost:8000/tournaments/${tournamentId}`, { withCredentials: true });
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

export const joinTournament = async (tournamentId) => {
    try {
        const res = await axios.post("http://localhost:8000/tournaments/join-tournament", { tournamentId }, { withCredentials: true })
        alert("Successfully joined tournament");
        return res.data;
    }
    catch (err) {
        console.log("Join tournament failed: ", err);
        if (err.response) {
            alert(err.response.data);
        }
        else {
            alert("Something went wrong");
        }
    }
}

export const leaveTournament = async () => {
    try {
        const res = await axios.post("http://localhost:8000/tournaments/leave", {}, { withCredentials: true });
        alert("You have left the tournament");
        return res.data;
    }
    catch (err) {
        console.log("Leave tournament failed: ", err);
        if (err.response) {
            alert(err.response.data);
        }
        else {
            alert("Something went wrong");
        }
    }
}

export const removeTeamFromTournament = async (teamId, tournamentId) => {
    try {
        const res = await axios.delete(`http://localhost:8000/tournaments/${tournamentId}/teams/${teamId}`, { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error("Failed to remove team:", err.response?.data || err.message);
        return null;
    }
}

export const startTournament = async (tournamentId) => {
    try {
        const res = await axios.post(`http://localhost:8000/tournaments/start/${tournamentId}`, {}, { withCredentials: true });
        return res.data;
    } catch (err) {
        console.log(err);
        alert(err.response.data);
    }
}

export const advanceToNextRound = async (tournamentId) => {
    try {
        const res = await axios.post(`http://localhost:8000/tournaments/${tournamentId}/advance`, {}, { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const completeTournament = async (tournamentId) => {
    try {
        const res = await axios.put(`http://localhost:8000/tournaments/${tournamentId}/complete`, {}, { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error("Error completing tournament", err);
        alert(err.response.data);
        return null;
    }
};

export const getChampionshipsByTeam = async (teamId) => {
    try {
        const res = await axios.get(`http://localhost:8000/tournaments/championships/${teamId}`, { withCredentials: true });
        return res.data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}