let allowedOrigins = [
    "http://localhost:8080",
    "http://localhost:1234",
    "https://seedkeeper.herokuapp.com",
];

const corsConfig = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            // If a specific origin isn’t found on the list of allowed origins
            let message =
                "The CORS policy for this application doesn’t allow access from origin " +
                origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
};

exports.module = corsConfig;
