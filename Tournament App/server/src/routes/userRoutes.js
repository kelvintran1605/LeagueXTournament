import express from "express";
import verifyEmail from "../middleware/verifyEmail.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import { createUser, getAllUsers, loginUser, logoutUser, getProfile, updateProfile, updatePassword, deleteUser, createAdmin } from "../controllers/usersController.js";
import "../config/passport.js";
import { createTeamId } from "../controllers/usersController.js";
import { upload } from "../config/cloudinary.js";
import authenticateUser from "../middleware/authenticateUser.js";
const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);

userRoutes.post("/create", createUser);

userRoutes.post("/login", loginUser);

userRoutes.put("/update-password", authenticateUser, updatePassword);

userRoutes.post("/logout", logoutUser);

userRoutes.get("/profile", authenticateUser, getProfile);

userRoutes.put("/createTeamId", createTeamId);

userRoutes.put("/update", upload.single("image"), authenticateUser, updateProfile);

userRoutes.post("/check-email", verifyEmail);


userRoutes.delete("/:userId", deleteUser);

userRoutes.post("/create-admin", verifyAdmin, createAdmin);

export default userRoutes;

