import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true },
    round: { type: Number, required: true },
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    score: { type: String }, // e.g., "3-1"
    date: { type: Date, required: true },
    location: { type: String, required: true },
    field: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "completed", "canceled"], default: "scheduled" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Match", matchSchema);
