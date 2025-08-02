import Team from "../models/Team.js";
import { cloudinary, upload } from "../config/cloudinary.js";
import mongoose from "mongoose";
import JoinRequest from "../models/JoinRequest.js";
import User from "../models/User.js";
import Invitation from "../models/Invitation.js";
import Tournament from "../models/Tournament.js";
export const getAllTeamsByRequests = async (req, res) => {
    // We will get the join requests to teams and then exclude it from the original list of teams
    try {
        const sentRequests = await JoinRequest.find({ userId: req.user._id }).select("teamId");
        const sentTeamIds = sentRequests.map(r => r.teamId);

        const teamData = await Team.find({ _id: { $nin: sentTeamIds } });
        res.status(200).send(teamData);
    }
    catch (err) {
        console.log("error getting teams");
        res.status(500).send({ error: "Error in fetching user data" });
    }
}

export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).send(teams);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: "Error in fetching user data" });
    }
}

export const createTeam = async (req, res) => {
    const { name, description, location, contactEmail, captainId } = req.body;
    if (!req.file) {
        return res.status(400); // If there's no image, respond with bad request error
    }
    let response = null;

    try {
        const base64EncodedImage = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype};base64,${base64EncodedImage}`;
        // Use cloudinary uploader to upload the image
        response = await cloudinary.uploader.upload(dataUri);
        const newTeam = new Team({
            name,
            description,
            location,
            teamLogo: {
                publicId: response.public_id,
                url: response.secure_url
            },
            contactEmail,
            captainId,
            playerIds: [captainId]
        });
        const { _id } = await newTeam.save();
        return res.status(201).json({ _id });
    }
    catch (err) {
        console.log(err.message);
        await cloudinary.uploader.destroy(response.public_id);
        return res.status(500).send("Internal server error");
    }
}

export const updateTeam = async (req, res) => {
    const { name, description, location, contactEmail } = req.body;
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        let updatedFields = {
            name,
            description,
            location,
            contactEmail
        };
        if (req.file) {
            const base64EncodedImage = req.file.buffer.toString("base64");
            const dataUri = `data:${req.file.mimetype};base64,${base64EncodedImage}`;

            const response = await cloudinary.uploader.upload(dataUri, {
                public_id: team.teamLogo?.publicId,
                overwrite: true,
                invalidate: true
            });

            updatedFields.teamLogo = {
                publicId: response.public_id,
                url: response.secure_url
            };
        }

        await Team.updateOne({ _id: teamId }, { $set: updatedFields });

        return res.status(200).json({ message: "Team updated successfully" });
    }
    catch (err) {
        console.log(err.message);
        await cloudinary.uploader.destroy(response.public_id);
        return res.status(500).send("Internal server error");
    }
}

export const getTeamInfo = async (req, res) => {
    const { teamId } = req.params;
    try {
        const team = await Team.findById(teamId).populate("playerIds", "_id name position email profileImage");
        if (!team) return res.status(404).send("Team not found");
        res.status(201).send(team);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

export const removePlayer = async (req, res) => {
    const { userId, teamId } = req.body;
    try {
        const updatedTeam = await Team.findByIdAndUpdate(teamId, { $pull: { playerIds: userId } }, { new: true });
        const updatedUser = await User.findByIdAndUpdate(userId, { $unset: { teamId: "" } }, { new: true });
        await JoinRequest.deleteOne({ userId, teamId });
        await Invitation.deleteOne({ userId, teamId });
        if (updatedTeam && updatedUser) {
            res.status(200).send("Removed player from team successfully")
        } else {
            res.status(404).send();
        }
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send("Internal server error");
    }
}

export const getChampionshipsGroupedByTeam = async (req, res) => {
    try {
        const championships = await Tournament.find({
            status: "finished",
            winner: { $ne: null }
        }).populate("winner");

        const grouped = {};

        championships.forEach(tournament => {
            const teamId = tournament.winner._id;
            if (!grouped[teamId]) {
                grouped[teamId] = {
                    team: tournament.winner,
                    championships: []
                };
            }
            grouped[teamId].championships.push({
                name: tournament.name,
                location: tournament.location,
                year: new Date(tournament.createdAt).getFullYear()
            });
        });

        res.status(200).json(Object.values(grouped));
    } catch (err) {
        console.error("Error grouping championships", err);
        res.status(500).json({ message: "Server error" });
    }
};