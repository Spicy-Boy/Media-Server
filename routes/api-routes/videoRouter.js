const router = require("express").Router();
const path = require("path");

const {
    streamVideoTEST
} = require("../../controllers/videoController");

router.get("/videoTEST", streamVideoTEST);

module.exports = router;