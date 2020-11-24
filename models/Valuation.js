const mongoose = require("mongoose");
const { TaskSchema } = require("../models/Task");

let ValuationSchema = mongoose.Schema({
    Status: { type: String, default: "open" },
    ValuationTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ValuationTemplate",
        required: true,
    },
    VarietyName: { type: String, required: true },
    Year: { type: Number, required: true },
    User: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Tasks: [TaskSchema],
});

module.exports = mongoose.model("Valuation", ValuationSchema);
