// const mongoose = require("mongoose");
const User = require("../models/User");
const Token = require("../models/Token");
const { JWTauth } = require("../middlewares/jwt");
const { check, validationResult } = require("express-validator");
const crypto = require("crypto");
const mailer = require("../middlewares/mailer");
const { MAIL } = require("../helpers/constants");

exports.userList = [
    JWTauth,
    function (req, res) {
        User.find()
            .then((users) => {
                res.status(201).json(users);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error:" + error);
            });
    },
];

exports.userCreate = [
    // Validation and sanitization chains
    check("username")
        .not()
        .isEmpty()
        .withMessage("Username is required.")
        .isAlphanumeric()
        .withMessage("Username can only contain alphanumeric values.")
        .trim()
        .escape(),
    check("email")
        .not()
        .isEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Email must be a valid email address."),
    check("password")
        .not()
        .isEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Your password should have at least 6 characters.")
        .trim()
        .escape(),

    function (req, res) {
        // Extract the validation errors from request.
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        if (!req.body) {
            const message = "Missing request body";
            res.status(400).send(message);
        }
        let hashedPassword = User.hashPassword(req.body.password);
        User.findOne({ Email: req.body.email })
            .then((user) => {
                if (user) {
                    return res.status(400).send({
                        message: `User with email ${req.body.email} already exists`,
                    });
                }
                const newUser = new User({
                    Username: req.body.username,
                    Password: hashedPassword,
                    Email: req.body.email,
                });
                newUser
                    .save()
                    .then((user) => {
                        // Create a verification token for this user
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
                                user.Email,
                                "Account Verification Token",
                                html
                            )
                            .then(() => {
                                res.status(200).send({
                                    message: `A verification email has been sent to ${req.body.email}`,
                                });
                            })
                            .catch((error) => {
                                console.error(error);
                                res.status(500).send("Error: " + error);
                            });
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send("Error: " + error);
                    });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    },
];

exports.userUpdate = [
    JWTauth,

    // Validation and sanitization chains
    check("username")
        .not()
        .isEmpty()
        .withMessage("Username is required.")
        .isAlphanumeric()
        .withMessage("Username can only contain alphanumeric values.")
        .trim()
        .escape(),
    check("email")
        .not()
        .isEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Email must be a valid email address.")
        .normalizeEmail(),
    check("password")
        .not()
        .isEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Your password should have at least 6 characters.")
        .trim()
        .escape(),

    function (req, res) {
        // Extract the validation errors from request.
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        
        let hashedPassword = User.hashPassword(req.body.password);
        User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    Username: req.body.username,
                    Email: req.body.email,
                    Password: hashedPassword,
                },
            },
            { new: true }
        )
            .then((updatedUser) => {
                if (updatedUser) {
                    res.status(201).json(updatedUser);
                } else {
                    res.status(404).send(
                        `User with id ${req.params.id} was not found`
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    },
];

exports.userDetail = [
    JWTauth,
    function (req, res) {
        User.findById(req.params.id)
            .then((user) => {
                res.status(201).json(user);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error:" + error);
            });
    },
];

exports.userDelete = [
    JWTauth,
    function (req, res) {
        User.findByIdAndDelete(req.params.id)
            .then((user) => {
                if (!user) {
                    return res
                        .status(404)
                        .send(`User with id ${req.params.id} was not found`);
                }
                return res
                    .status(201)
                    .send(`User with id ${req.params.id} was deleted`);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: + " + err);
            });
    },
];
