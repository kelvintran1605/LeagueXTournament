import express from "express";
import verifyAdmin from "../middleware/verifyAdmin.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { getGamesPlayedByTeam, getMatchesByCurrentRound, getUpcomingMatchesByTeamId, updateMatchResult } from "../controllers/matchController.js";
const matchRoutes = express.Router();

matchRoutes.use(authenticateUser);

matchRoutes.get("/current/:tournamentId", getMatchesByCurrentRound);

matchRoutes.put("/update-result/:matchId", verifyAdmin, updateMatchResult);

matchRoutes.get("/upcoming/:teamId", getUpcomingMatchesByTeamId);

matchRoutes.get("/played/team/:teamId", getGamesPlayedByTeam);

export default matchRoutes;
