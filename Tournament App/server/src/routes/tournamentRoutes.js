import express from "express";
import verifyAdmin from "../middleware/verifyAdmin.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { advanceToNextRound, completeTournament, createTournament, deleteTournament, getAllTournaments, getChampionshipsByTeam, joinTournament, leaveTournament, removeTeamFromTournament, startTournament } from "../controllers/tournamentController.js";
const tournamentRoutes = express.Router();

tournamentRoutes.use(authenticateUser);

tournamentRoutes.post("/", verifyAdmin, createTournament);

tournamentRoutes.get("/", getAllTournaments);

tournamentRoutes.post("/join-tournament", joinTournament);

tournamentRoutes.delete("/:tournamentId", verifyAdmin, deleteTournament);

tournamentRoutes.post("/leave", leaveTournament);

tournamentRoutes.delete("/:tournamentId/teams/:teamId", verifyAdmin, removeTeamFromTournament);

tournamentRoutes.post("/start/:tournamentId", verifyAdmin, startTournament);

tournamentRoutes.post("/:tournamentId/advance", verifyAdmin, advanceToNextRound);

tournamentRoutes.put("/:tournamentId/complete", verifyAdmin, completeTournament);

tournamentRoutes.get("/championships/:teamId", getChampionshipsByTeam);

export default tournamentRoutes;