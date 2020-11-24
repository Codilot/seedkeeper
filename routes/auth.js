let express = require("express");
const AuthController = require("../controllers/AuthController");

let router = express.Router();

router.get("/", AuthController.loginPage);
router.post("/", AuthController.login);
router.get("/confirmation/:token", AuthController.confirmation);
router.post("/resend", AuthController.resendTokenPost);


module.exports = router;
