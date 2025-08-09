const router = require("express").Router();
const path = require("path");

const {
    loginAndAttachUserToSession,
    validateLogin,
    validateIsLoginWithRedirect,
    validateLoginConditionallyForFile,
    updateUserPermissionsAndFiles,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
 } = require("../middlewares/authRemaster");

//vv API for the BTW Speedrunning Competition donation portal -- no auth!
const donationRouter = require("./api-routes/donationRouter");
router.use("/api/donations", donationRouter);

const moderationRouter = require("./api-routes/moderationRouter");
router.use("/api/moderation", moderationRouter);

const userRouter = require("./api-routes/userRouter");
router.use("/api/user", userRouter);

const fileRouter = require("./api-routes/fileRouter");
router.use("/api/file", fileRouter);

const aiRouter = require("./api-routes/aiRouter");
router.use("/api/ai", aiRouter);

