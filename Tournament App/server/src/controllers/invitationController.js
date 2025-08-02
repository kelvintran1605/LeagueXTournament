import Invitation from "../models/Invitation.js";
import Team from '../models/Team.js';
import User from '../models/User.js';

export const createInvitation = async (req, res) => {
    const { email, teamId } = req.body;
    try {
        // Check if user exists 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("Email not found");
        }

        if (user.role === "admin") {
            return res.status(403).send("Email not found");
        }
        // Check if user had a team
        const isInvited = await Invitation.findOne({ userId: user._id, teamId });
        if (isInvited) {
            return res.status(409).send("User has already been invited to this team");
        }

        // Check if user is in any team
        if (user.teamId) {
            return res.status(400).send("User is already in a team");
        }

        const newInvitation = new Invitation({
            userId: user._id,
            teamId
        })
        const savedInvitation = await newInvitation.save();
        const populatedInvitation = await Invitation.findById(savedInvitation._id).populate("userId", "name position profileImage");
        return res.status(201).send(populatedInvitation);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

export const getInvitationsByUserId = async (req, res) => {
    const userId = req.user._id;
    try {
        const invitations = await Invitation.find({ userId }).populate("teamId");
        res.status(200).send(invitations);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

export const getInvitationsByTeamId = async (req, res) => {
    const { teamId } = req.params;
    try {
        const invitations = await Invitation.find({ teamId }).select("userId status").populate("userId", "name location");
        res.status(200).send(invitations);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

export const acceptInvitation = async (req, res) => {
    const { teamId } = req.body;
    const userId = req.user._id;
    try {
        // Find the invitation by teamId and userId
        const invitation = await Invitation.findOne({ teamId, userId });
        if (!invitation) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        // Check if the team exists
        const team = await Team.findById(teamId);
        console.log(team);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        // Check if user is already in the team
        if (team.playerIds.includes(userId)) {
            return res.status(400).json({ message: "User already in the team" });
        }

        // Update the invitation status to "approved"
        invitation.status = "approved";
        await invitation.save();

        // Add the user to the team
        await Team.findByIdAndUpdate(teamId, {
            $addToSet: { playerIds: userId } // $addToSet ensures no duplicates
        });

        // Delete all other invitations for the user (except this one)
        await Invitation.deleteMany({
            userId,
            _id: { $ne: invitation._id }
        });

        // Update the user's teamId field
        await User.findByIdAndUpdate(userId, { teamId });

        // Optionally fetch updated user info
        const updatedUser = await User.findById(userId);

        // Return success message and updated user
        res.status(200).json({
            message: "Invitation accepted, user added to team, other invitations removed",
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelInvitation = async (req, res) => {
    const { userId, teamId } = req.body;
    console.log(userId, teamId);
    try {
        const result = await Invitation.deleteOne({ userId, teamId });
        if (result.deletedCount === 1) {
            res.status(200).send("Deleted successfully");
        }
        else {
            res.status(404).send("Invitation not found");
        }
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
}

export const declineInvitation = async (req, res) => {
    const { teamId } = req.body;
    const userId = req.user._id;

    if (!userId || !teamId) {
        return res.status(400).json({ message: "Missing userId or teamId" });
    }

    try {
        const result = await Invitation.deleteOne({ userId, teamId });
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