import express from "express";
import authenticateUser from "../middleware/authenticateUser.js";
import { acceptInvitation, createInvitation, getInvitationsByUserId, getInvitationsByTeamId, cancelInvitation, declineInvitation } from "../controllers/invitationController.js";
const invitationRoutes = express.Router();

invitationRoutes.use(authenticateUser);

invitationRoutes.post("/", createInvitation);
invitationRoutes.get("/", getInvitationsByUserId);
invitationRoutes.get("/:teamId", getInvitationsByTeamId);
invitationRoutes.put("/accept", acceptInvitation);
invitationRoutes.delete("/decline", declineInvitation);
invitationRoutes.delete("/cancel", cancelInvitation);

export default invitationRoutes;