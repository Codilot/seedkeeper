const mongoose = require("mongoose");
const { TaskDetailSchema } = require("../models/TaskDetail");

const TaskSchema = mongoose.Schema({
    Status: { type: String, default: "open" },
    Value: { type: String },
    TaskDetail: TaskDetailSchema,
});

exports.TaskSchema = TaskSchema;
exports.Task = mongoose.model("Task", TaskSchema);