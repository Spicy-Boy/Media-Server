const router = require("express").Router();

const { //import auth
    redirectLogin
} = require("../middlewares/authMiddleware");

const {
    uploadInChunks
} = require("../controllers/fileController");

router.post("/upload", redirectLogin, uploadInChunks);

module.exports = router;