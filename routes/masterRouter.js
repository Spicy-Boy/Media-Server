const router = require("express").Router();
const path = require("path");

const viewRouter = require("./viewRouter");
router.use("/", viewRouter);

const apiRouter = require("./apiRouter");
router.use("/api", apiRouter);

module.exports = router;