const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    passportJWT = require("passport-jwt"),
    User = require("../models/User");

let JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: "Username",
            passwordField: "Password",
        },
        (username, password, callback) => {
            console.log(username + "  " + password);
            User.findOne(
                {
                    Username: username,
                },
                (error, user) => {
                    if (error) {
                        console.log(error);
                        return callback(error);
                    }
                    if (!user) {
                        console.log("incorrect username");
                        return callback(null, false, {
                            message: "Incorrect username.",
                        });
                    }
                    if (!user.validatePassword(password)) {
                        console.log("incorrect password");
                        return callback(null, false, {
                            message: "Incorrect password.",
                        });
                    }
                    console.log("finished");
                    return callback(null, user);
                }
            );
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        (jwtPayload, callback) => {
            return User.findById(jwtPayload._id)
                .then((user) => {
                    return callback(null, user);
                })
                .catch((error) => {
                    return callback(error);
                });
        }
    )
);

