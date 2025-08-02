import JoinRequest from "../models/JoinRequest.js";
import Team from '../models/Team.js';
import User from '../models/User.js';

export const createRequests = async (req, res) => {
    const { _id: userId } = req.user;
    const { teamId } = req.params;
    try {
        const newRequest = new JoinRequest({
            userId,
            teamId,
            status: "pending"
        })
        const savedRequest = await newRequest.save();
        console.log(savedRequest.teamId);
        return res.status(201).send(savedRequest);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}


export const getRequestsByUserId = async (req, res) => {
    try {
        const requests = await JoinRequest.find({ userId: req.user._id }).select("teamId status").populate("teamId", "name teamLogo location playerIds");
        res.status(200).send(requests);
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
}

export const deleteRequest = async (req, res) => {
    const { teamId } = req.params;
    try {
        const result = await JoinRequest.deleteOne({ userId: req.user._id, teamId: teamId });
        if (result.deletedCount === 1) {
            res.status(200).send("Deleted successfully");
        }
        else {
            res.status(404).send("Request not found");
        }
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
}

export const declineRequest = async (req, res) => {
    const { userId, teamId } = req.body;
    if (!userId || !teamId) {
        return res.status(400).json({ message: "Missing userId or teamId" });
    }

    try {
        const result = await JoinRequest.deleteOne({ userId, teamId });
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Declined successfully" });
        } else {
            return res.status(404).json({ message: "Request not found" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRequestsByTeamId = async (req, res) => {
    const { teamId } = req.params;
    try {
        const requests = await JoinRequest.find({ teamId }).select("userId status").populate("userId", "_id name email position profileImage");
        res.status(200).send(requests);
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
}

export const acceptRequest = async (req, res) => {
    const { userId, teamId } = req.body;
    try {
        const request = await JoinRequest.findOne({ teamId, userId });
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Add user to team
        await Team.findByIdAndUpdate(teamId, {
            $addToSet: { playerIds: userId }
        });

        // Delete all requests from this user (including this one)
        await JoinRequest.deleteMany({ userId });

        // Set user's teamId
        await User.findByIdAndUpdate(userId, { teamId });

        res.status(200).json({ message: "Request accepted, user added, all requests removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
