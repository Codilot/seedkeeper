const express = require("express");
const staticRouter = require("./static");
const userRouter = require("./user");
const valuationTemplateRouter = require("./valuationTemplate");
const valuationRouter = require("./valuation");
const authRouter = require("./auth");

const app = express();

// Register routes here
app.use("/", staticRouter);
app.use("/users/", userRouter);
app.use("/templates/", valuationTemplateRouter);
app.use("/valuations/", valuationRouter);
app.use("/login", authRouter);

module.exports = app;
