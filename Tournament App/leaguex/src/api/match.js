import axios from "axios"

export const getMatchesByCurrentRound = async (tournamentId) => {
    try {
        const res = await axios.get(`http://localhost:8000/matches/current/${tournamentId}`, { withCredentials: true });
        return res.data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

export const updateMatchResult = async (matchId, score) => {
    try {
        const res = await axios.put(`http://localhost:8000/matches/update-result/${matchId}`, { score }, { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error("Error in updating match results:", err.response?.data || err.message);
        return null;
    }
};