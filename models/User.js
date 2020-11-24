const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let UserSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    Valuations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Valuation",
        },
    ],
    ValuationTemplates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ValuationTemplate",
        },
    ],
});

UserSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

// No arrow function here because the Password
// should be read from the instance where it is called from.
UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};


module.exports = mongoose.model("User", UserSchema);
