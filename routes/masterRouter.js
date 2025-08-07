const router = require("express").Router();
const path = require("path");

const viewRouter = require("./viewRouter");
router.use("/", viewRouter);

const userRouter = require("./userRouter");
router.use("/api/user", userRouter);

const fileRouter = require("./fileRouter");
router.use("/api/file", fileRouter);

const aiRouter = require("./aiRouter");
router.use("/api/ai", aiRouter);

//vv API for the BTW Speedrunning Competition donation portal
const donationRouter = require("./donationRouter");
router.use("/api/donations", donationRouter);

module.exports = router;