const mongoose = require("mongoose");

const TaskDetailSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Category: { type: String, required: true },
    StartMonth: { type: Number, required: true },
    EndMonth: { type: Number, required: true },
    InputType: { type: String, required: true },
    InputOptions: { type: Array, required: false },
    ValuationTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ValuationTemplate",
    },
});

exports.TaskDetailSchema = TaskDetailSchema;
exports.TaskDetail = mongoose.model("Taskdetail", TaskDetailSchema);