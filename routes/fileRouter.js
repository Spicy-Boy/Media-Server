const router = require("express").Router();

const { //import auth
    redirectLogin
} = require("../middlewares/authMiddleware");

const {
    uploadInChunks,
    createPersonalDatabaseEntry,
    downloadFile,
    deleteFile,
    toggleVisibility
} = require("../controllers/fileController");

// /api/file/upload
router.post("/upload", redirectLogin, uploadInChunks);
router.post("/createEntry", redirectLogin, createPersonalDatabaseEntry);
router.get("/download/:username/:fileId", redirectLogin, downloadFile);

router.post("/delete/:fileId", redirectLogin, deleteFile);
router.post("/toggleVisibility/:fileId", redirectLogin, toggleVisibility);

module.exports = router;