import mongoose from "mongoose";

// Create schema
const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    playerIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match"
    }],
    teamLogo: {
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    description: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    captainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    invitationRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        }
    ],
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", default: null }
});

// Create model from schema
const Team = mongoose.model("Team", teamSchema);

export default Team;