const passport = require("passport");
const { generateJWTToken } = require("../middlewares/jwt");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Token = require("../models/Token");
const mailer = require("../middlewares/mailer");
const { MAIL } = require("../helpers/constants");


exports.login = [
    // Validation and sanitization chains
    check("Username")
        .not()
        .isEmpty()
        .withMessage("Username is required.")
        .isAlphanumeric()
        .withMessage("You have a non-alphanumeric typo in your username.")
        .trim()
        .escape(),
    check("Password")
        .not()
        .isEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage(
            "Your password is missing some characters, because it's too short."
        )
        .escape(),

    function (req, res) {
        // Extract the validation errors from request.
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        passport.authenticate(
            "local",
            {
                session: false,
            },
            (error, user, info) => {
                if (error || !user) {
                    return res.status(400).json({
                        message: "Something is not right",
                        user: user,
                    });
                }
                // Make sure the user has been verified
                if (!user.isVerified) {
                    return res.status(401).send({
                        type: "not-verified",
                        message: "Your account has not been verified.",
                    });
                }
                req.login(user, { session: false }, (error) => {
                    if (error) {
                        res.send(error);
                    }
                    let token = generateJWTToken(user.toJSON());
                    return res.json({ user, token });
                });
            }
        )(req, res);
    },
];


exports.loginPage = [
    function (req, res) {
        let responseText = "Login to my seedsaver app!";
        responseText += "<small>Requested at: " + req.requestTime + "</small>";
        res.send(responseText);
    },
];

exports.confirmation = [
    check("token")
        .not()
        .isEmpty()
        .withMessage("Token cannot be blank.")
        .isLength({ min: 15 })
        .trim()
        .escape()
        .withMessage("Invalid Token."),

    function (req, res) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        Token.findOne({ token: req.params.token })
            .then((token) => {
                if (!token) {
                    return res
                        .status(400)
                        .send(
                            "We were unable to find a valid token. Your token may have expired."
                        );
                }
                // If a token is found, find a matching user
                User.findOne({
                    _id: token._userId,
                }).then((user) => {
                    if (!user) {
                        return res
                            .status(404)
                            .send({ message: "No users found for this token" });
                    }
                    if (user.isVerified) {
                        return res.status(400).send({
                            message:
                                "The email address is already confirmed for this user",
                        });
                    }
                    // Verify user
                    user.isVerified = true;
                    user.save()
                        .then((user) => {
                            res.status(200).send({
                                message: `Welcome ${user.Username}, your account has been verified. Please log in.`,
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send("Error: " + error);
                        });
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    },
];

// json example
// {
//     "email": "eve@eve.com"
// }
exports.resendTokenPost = [
    function (req, res) {
        User.findOne({ Email: req.body.email }).then((user) => {
            if (!user) {
                return res
                    .status(404)
                    .send({ message: "No users found for this email" });
            }
            if (user.isVerified) {
                return res.status(400).send({
                    message: "This account is already confirmed. Please login",
                });
            }
            // Create a verification token, save it, and send email
            let token = new Token({
                _userId: user._id,
                token: crypto.randomBytes(16).toString("hex"),
            });
            token.save().catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
            //Send Confirmation Email
            let html = `<p>Please verify your account by clicking this link:</p>
                        <p>http://${req.headers.host}/login/confirmation/${token.token}</p>`;
            mailer
                .send(
                    MAIL.confirmMail.from,
                    req.body.email,
                    "Confirm Account",
                    html
                )
                .catch((error) => {
                    console.error(error);
                    res.status(500).send("Error: " + error);
                });
        });
    },
];