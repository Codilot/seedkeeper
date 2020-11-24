let express = require("express");
const TemplateController = require("../controllers/ValuationTemplateController");
const TaskDetailController = require("../controllers/TaskDetailController");

var router = express.Router();

router.get("/", TemplateController.valuationTemplateList);
router.get("/:id", TemplateController.valuationTemplateDetail);
router.post("/", TemplateController.valuationTemplateCreate);

router.post("/:id/taskdetails", TaskDetailController.taskDetailCreate);
router.get(
    "/:id/taskdetails/:taskdetail_id",
    TaskDetailController.taskDetailDetail
);

module.exports = router;
