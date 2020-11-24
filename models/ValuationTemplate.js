const mongoose = require("mongoose");
const { TaskDetailSchema } = require("../models/TaskDetail");

let ValuationTemplateSchema = mongoose.Schema({
    Name: { type: String, required: true },
    TaskDetails: [TaskDetailSchema],
});

module.exports = mongoose.model("ValuationTemplate", ValuationTemplateSchema);
