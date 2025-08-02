import express from "express";
import { createTeam, getAllTeams, getAllTeamsByRequests, getChampionshipsGroupedByTeam, getTeamInfo, removePlayer, updateTeam } from "../controllers/teamController.js";
import { upload } from "../config/cloudinary.js";
const teamRoutes = express.Router();

teamRoutes.get("/", getAllTeamsByRequests);
teamRoutes.get("/championships", getChampionshipsGroupedByTeam);
teamRoutes.get("/allTeams", getAllTeams);
teamRoutes.get("/:teamId", getTeamInfo);
teamRoutes.post("/create", upload.single("image"), createTeam);
teamRoutes.put("/:teamId", upload.single("image"), updateTeam);
teamRoutes.delete("/remove-player", removePlayer);

export default teamRoutes;
