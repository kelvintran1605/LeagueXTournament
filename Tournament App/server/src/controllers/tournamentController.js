import Team from "../models/Team.js";
import Tournament from "../models/Tournament.js";
import Match from "../models/Match.js";

export const createTournament = async (req, res) => {
    const { name, description, roundStartDates, location, field } = req.body;
    try {
        const newTournament = new Tournament({
            name,
            description,
            roundStartDates,
            location,
            field
        });
        const savedTournament = await newTournament.save();
        res.status(200).send(savedTournament);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

export const getAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().populate("teamIds").populate("winner");
        if (tournaments) {
            res.status(200).send(tournaments);
        }
        else {
            res.status(404).send("Cannot find any tournaments");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

export const deleteTournament = async (req, res) => {
    const { tournamentId } = req.params;
    try {
        const deletedTournament = await Tournament.findByIdAndDelete(tournamentId);
        if (deletedTournament) {
            res.status(200).send(deletedTournament);
        }
        else {
            res.status(404).send("Cannot find the tournament");
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).send("Something went wrong");
    }
}

export const joinTournament = async (req, res) => {
    // Check team captain
    const { _id, teamId } = req.user;
    const { tournamentId } = req.body;
    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).send("Team not found");

        if (team.captainId.toString() !== _id.toString()) {
            return res.status(403).send("Only the team captain can join a tournament");
        }

        if (team.tournamentId) {
            return res.status(400).send("This team is already in a tournament");
        }

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).send("Tournament not found");
        }

        if (tournament.teamIds.length === 8) {
            return res.status(400).send("This tournament has reached its maximum team capacity. Please consider joining a different tournament.");
        }

        if (tournament.teamIds.length === 7) {
            tournament.status = "ready";
        }
        tournament.teamIds.push(team._id);
        await tournament.save();

        team.tournamentId = tournament._id;
        await team.save();

        const populatedTournament = await Tournament.findById(tournamentId).populate("teamIds");

        return res.status(200).json(populatedTournament);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
}

export const leaveTournament = async (req, res) => {
    const { _id, teamId } = req.user;

    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).send("Team not found");

        if (team.captainId.toString() !== _id.toString()) {
            return res.status(403).send("Only the team captain can leave the tournament");
        }

        if (!team.tournamentId) {
            return res.status(400).send("This team is not in any tournament");
        }

        const tournament = await Tournament.findById(team.tournamentId);
        if (!tournament) return res.status(404).send("Tournament not found");

        if (tournament.teamIds.length === 8) {
            tournament.status = "waiting";
        }

        tournament.teamIds = tournament.teamIds.filter(id => id.toString() !== team._id.toString());
        await tournament.save();

        team.tournamentId = null;
        await team.save();

        const updatedTournament = await Tournament.findById(tournament._id).populate("teamIds");
        return res.status(200).json(updatedTournament);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
}

export const removeTeamFromTournament = async (req, res) => {
    const { tournamentId, teamId } = req.params;
    console.log("Hi" + tournamentId);
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).send("Tournament not found");
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).send("Team not found");
        }

        // Remove team from tournament's teamIds
        tournament.teamIds = tournament.teamIds.filter(
            tId => tId.toString() !== teamId
        );
        await tournament.save();

        // Clear tournamentId in team
        if (team.tournamentId?.toString() === tournamentId) {
            team.tournamentId = null;
            await team.save();
        }

        return res.status(200).send("Team removed from tournament successfully");
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
}

export const startTournament = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        const tournament = await Tournament.findById(tournamentId).populate("teamIds");

        if (!tournament) return res.status(404).send("Tournament not found");
        if (tournament.status !== "ready") return res.status(400).send("Tournament is not ready");

        const teams = tournament.teamIds;

        if (teams.length < 2 || teams.length % 2 !== 0) {
            return res.status(400).send("Number of teams must be even and at least 2");
        }

        // Shuffle teams
        const shuffled = teams.sort(() => 0.5 - Math.random());

        const matches = [];
        const round = 1;
        const date = tournament.roundStartDates?.[0] || new Date(); // fallback if roundStartDates is empty

        for (let i = 0; i < shuffled.length; i += 2) {
            matches.push({
                tournamentId: tournament._id,
                location: tournament.location,
                field: tournament.field,
                round,
                teamA: shuffled[i]._id,
                teamB: shuffled[i + 1]._id,
                date,
                status: "scheduled",
            });
        }

        await Match.insertMany(matches);

        // Update tournament status
        tournament.status = "ongoing";
        tournament.currentRound = round;
        await tournament.save();
        const updatedTournament = await Tournament.findById(tournamentId).populate("teamIds");

        res.status(200).send(updatedTournament);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

export const advanceToNextRound = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return res.status(404).send("Tournament not found");

        const currentRound = tournament.currentRound;

        const completedMatches = await Match.find({
            tournamentId,
            round: currentRound,
            status: "completed"
        });

        const winners = completedMatches
            .map(match => match.winner)
            .filter(winner => winner);

        if (winners.length < 2 || winners.length % 2 !== 0) {
            return res.status(400).send("Cannot advance. Winners must be even and >= 2");
        }

        const newRound = currentRound + 1;
        const newDate = tournament.roundStartDates?.[newRound - 1] || new Date();

        const newMatches = [];
        for (let i = 0; i < winners.length; i += 2) {
            newMatches.push({
                tournamentId,
                round: newRound,
                teamA: winners[i],
                teamB: winners[i + 1],
                date: newDate,
                status: "scheduled",
                location: tournament.location,
                field: tournament.field
            });
        }

        await Match.insertMany(newMatches);

        tournament.currentRound = newRound;
        await tournament.save();

        res.status(200).json({ message: `Advanced to round ${newRound}`, round: newRound });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

export const completeTournament = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return res.status(404).json({ message: "Tournament not found" });

        if (tournament.currentRound !== 3) {
            return res.status(400).json({ message: "Tournament is not in the final round" });
        }

        const finalMatches = await Match.find({ tournamentId, round: 3 });

        if (finalMatches.length !== 1 || finalMatches[0].status !== "completed") {
            return res.status(400).json({ message: "Final match not completed yet" });
        }

        const champion = finalMatches[0].winner;

        tournament.status = "finished";
        tournament.winner = champion;
        await tournament.save();

        await Team.updateMany(
            { _id: { $in: tournament.teamIds } },
            { $unset: { tournamentId: "" } }
        );

        const updatedTournament = await Tournament.findById(tournamentId).populate("winner").populate("teamIds");

        res.status(200).json({
            message: "Tournament completed. All teams are now free to join another tournament.",
            champion: updatedTournament.winner,
            updatedTournament
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error when completing tournament" });
    }
};


export const getChampionshipsByTeam = async (req, res) => {
    const { teamId } = req.params;
    if (!teamId) {
        return res.status(400).json({ message: "Missing teamId parameter" });
    }

    try {
        const tournaments = await Tournament.find();

        const championshipTournaments = [];

        for (const tournament of tournaments) {
            const finalRound = tournament.roundStartDates?.length || tournament.currentRound;

            const finalMatch = await Match.findOne({
                tournamentId: tournament._id,
                round: finalRound,
                status: "completed",
                winner: teamId
            });

            if (finalMatch) {
                championshipTournaments.push(tournament);
            }
        }
        res.status(200).json(championshipTournaments);
    } catch (err) {
        console.error("Error in getChampionshipsByTeam:", err);
        res.status(500).json({ message: "Server error while fetching championships" });
    }
};