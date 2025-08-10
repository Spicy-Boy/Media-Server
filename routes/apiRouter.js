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
router.use("/donations", donationRouter);

const moderationRouter = require("./api-routes/moderationRouter");
router.use("/moderation", moderationRouter);

const userRouter = require("./api-routes/userRouter");
router.use("/user", userRouter);

const fileRouter = require("./api-routes/fileRouter");
router.use("/file", fileRouter);

const aiRouter = require("./api-routes/aiRouter");
router.use("/ai", aiRouter);

module.exports = router;

