let express = require("express");
const AuthController = require("../controllers/AuthController");

let router = express.Router();

router.get("/", AuthController.loginPage);
router.post("/", AuthController.login);
router.post("/confirmation", AuthController.confirmationPost);
router.post("/resend", AuthController.resendTokenPost);


module.exports = router;
