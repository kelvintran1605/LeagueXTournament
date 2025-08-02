// models/Tournament.js
import mongoose from "mongoose";

const TournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teamIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    description: String,
    location: { type: String, required: true },
    field: { type: String, required: true },
    maxTeams: { type: Number, default: 8 },
    status: { type: String, enum: ["waiting", "ready", "ongoing", "finished", "canceled"], default: "waiting" },
    currentRound: { type: Number, default: 1 },
    roundStartDates: [{ type: Date }],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Tournament = mongoose.model("Tournament", TournamentSchema);

export default Tournament;
