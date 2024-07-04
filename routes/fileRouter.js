const router = require("express").Router();

const { //import auth
    redirectLogin
} = require("../middlewares/authMiddleware");

const {
    uploadInChunks
} = require("../controllers/fileController");

// /api/file/upload
router.post("/upload", redirectLogin, uploadInChunks);

module.exports = router;