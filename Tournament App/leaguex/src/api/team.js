import axios from "axios"

export const teamFetch = async (teamId) => {
    try {
        const response = await axios.get(`http://localhost:8000/teams/${teamId}`);
        const team = response.data;
        return team;
    }
    catch (err) {
        console.log(err);
    }
}


export const getAllTeams = async () => {
    try {
        const response = await axios.get("http://localhost:8000/teams", { withCredentials: true });
        const teams = response.data;
        return teams;
    }
    catch (err) {
        console.log(err?.response?.data || err.message);
    }
}

// Get all the teams (no exclude)
export const getTeams = async () => {
    try {
        const response = await axios.get("http://localhost:8000/teams/allTeams");
        return response.data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export const updateTeam = async (teamId, image, name, description, location, contactEmail) => {
    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("description", description);
    data.append("location", location);
    data.append("contactEmail", contactEmail);
    try {
        const response = await axios.put(`http://localhost:8000/teams/${teamId}`, data, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.status;
    } catch (err) {
        console.log("Update team failed:", err?.response?.data || err.message);
    }
};

export const removePlayer = async (userId, teamId) => {
    try {
        const response = await axios.delete("http://localhost:8000/teams/remove-player", { data: { userId, teamId } });
        return response.status
    } catch (err) {
        console.log(err);
        return err.response.status;
    }
}

export const getUpcomingMatchesByTeamId = async (teamId) => {
    try {
        const response = await axios.get(`http://localhost:8000/matches/upcoming/${teamId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching upcoming matches:", error);
        return null;
    }
};

export const getGamesPlayedByTeam = async (teamId) => {
    try {
        const response = await axios.get(`http://localhost:8000/matches/played/team/${teamId}`, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export const getChampionshipsGroupedByTeam = async () => {
    try {
        const response = await axios.get("http://localhost:8000/teams/championships");
        return response.data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}