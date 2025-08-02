import Match from "../models/Match.js";
import Tournament from "../models/Tournament.js";

export const getMatchesByCurrentRound = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return res.status(404).send("Tournament not found");

        const matches = await Match.find({
            tournamentId,
            round: tournament.currentRound
        })
            .populate("teamA", "name teamLogo")
            .populate("teamB", "name teamLogo")
            .populate("winner", "name teamLogo");

        res.status(200).json(matches);
    } catch (error) {
        console.error("Error getting matches:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateMatchResult = async (req, res) => {
    const { matchId } = req.params;
    const { score } = req.body;

    try {
        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ message: "Match not found" });

        const [scoreA, scoreB] = score.split("-").map(s => parseInt(s.trim(), 10));

        if (isNaN(scoreA) || isNaN(scoreB)) {
            return res.status(400).json({ message: "Invalid score format. Use format like '2-1'" });
        }

        if (scoreA === scoreB) {
            return res.status(400).json({ message: "Draws are not allowed. Please enter a score with a clear winner." });
        }

        match.score = score;
        match.status = "completed";

        if (scoreA > scoreB) {
            match.winner = match.teamA;
        } else {
            match.winner = match.teamB;
        }

        await match.save();
        res.status(200).json({ message: "Match result updated", match });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while updating match" });
    }
};

export const getUpcomingMatchesByTeamId = async (req, res) => {
    const { teamId } = req.params;
    try {
        const now = new Date();

        const upcomingMatches = await Match.find({
            status: "scheduled",
            date: { $gt: now },
            $or: [
                { teamA: teamId },
                { teamB: teamId }
            ]
        })
            .sort({ date: 1 })
            .populate("teamA teamB tournamentId");
        console.log(teamId);
        if (upcomingMatches.length === 0) {
            return res.status(404).json({ message: "No upcoming matches found for this team." });
        }

        res.status(200).json(upcomingMatches);
    } catch (err) {
        console.error("Error fetching upcoming matches:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getGamesPlayedByTeam = async (req, res) => {
    const { teamId } = req.params;
    try {
        const playedMatches = await Match.find({
            status: "completed",
            $or: [{ teamA: teamId }, { teamB: teamId }]
        }).populate("teamA teamB winner tournamentId");

        res.status(200).json(playedMatches.length);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while fetching team matches" });
    }
};