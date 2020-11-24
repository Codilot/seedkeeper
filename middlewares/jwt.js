const jwtSecret = process.env.JWT_SECRET; // This has to be the same key used in the JWTStrategy
const jwt = require("jsonwebtoken");
const passport = require("passport");

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: process.env.JWT_TIMEOUT_DURATION,
        algorithm: process.env.JWT_ALG_METHOD,
    });
};


module.exports.JWTauth = passport.authenticate("jwt", { session: false });
module.exports.generateJWTToken = generateJWTToken;
