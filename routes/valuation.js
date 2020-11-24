let express = require("express");
const ValuationController = require("../controllers/ValuationController");
const TaskController = require("../controllers/TaskController");

var router = express.Router();

router.get("/", ValuationController.valuationList);
router.get("/:id", ValuationController.valuationDetail);
router.post("/", ValuationController.valuationCreate);
router.put("/:id", ValuationController.valuationUpdate);
router.delete("/:id", ValuationController.valuationDelete);

router.get("/:id/tasks", TaskController.taskList);
router.get("/:id/tasks/:task_id", TaskController.taskDetail);
router.put("/:id/tasks/:task_id", TaskController.taskUpdate);


module.exports = router;
