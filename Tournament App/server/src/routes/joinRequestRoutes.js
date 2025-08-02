import express from "express";
import authenticateUser from "../middleware/authenticateUser.js";
import { createRequests, getRequestsByUserId, getRequestsByTeamId, acceptRequest, deleteRequest, declineRequest } from '../controllers/joinRequestController.js';
const requestRoutes = express.Router();

requestRoutes.delete("/decline", authenticateUser, declineRequest);
requestRoutes.post("/:teamId", authenticateUser, createRequests);
requestRoutes.get("/", authenticateUser, getRequestsByUserId);
requestRoutes.get("/:teamId", authenticateUser, getRequestsByTeamId);
requestRoutes.delete("/:teamId", authenticateUser, deleteRequest);
requestRoutes.put("/accept", authenticateUser, acceptRequest);
export default requestRoutes;