const router = require("express").Router();

const { //import auth
    redirectLogin,
    redirectLoginConditionally,
    validateLogin
} = require("../middlewares/authMiddleware");

const {
    uploadInChunks,
    createPersonalDatabaseEntry,
    downloadFile,
    sendFile,
    deleteFile,
    toggleVisibility
} = require("../controllers/fileController");

// /api/file/upload
router.post("/upload", redirectLogin, uploadInChunks);
router.post("/createEntry", redirectLogin, createPersonalDatabaseEntry);
router.get("/download/:username/:fileId", redirectLoginConditionally, downloadFile);

// router.get("/sendFileToWebpage/:username/:fileId", validateLogin, sendFile);
router.get("/sendFileToWebpage/:username/:fileId", validateLogin, sendFile);
// NOTE! AARON!!! Doesnt have auth yet! Make sure this only runs when acceptable auth is available, otherwise 
// not logged in users must not under any circumstances have access to this route. Not logged in users 
// just get fucked I guess

router.post("/delete/:fileId", redirectLogin, deleteFile);
router.post("/toggleVisibility/:fileId", redirectLogin, toggleVisibility);

module.exports = router;