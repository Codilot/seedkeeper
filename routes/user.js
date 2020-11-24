let express = require("express");
const UserController = require("../controllers/UserController");

let router = express.Router();

router.get("/", UserController.userList);
router.get("/:id", UserController.userDetail);
router.post("/", UserController.userCreate);
router.put("/:id", UserController.userUpdate);
router.delete("/:id", UserController.userDelete);

module.exports = router;
