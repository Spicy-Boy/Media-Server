const router = require("express").Router();

const { //import auth
    redirectLogin,
    redirectLoginConditionally,
    validateLogin
} = require("../../middlewares/authMiddleware");

const {
    uploadInChunks,
    createPersonalDatabaseEntry,
    downloadFile,
    sendFile,
    deleteFile,
    toggleVisibility,
    sendSingleUsersFileList
} = require("../../controllers/fileController");

// /api/file/upload vv
router.post("/upload", redirectLogin, uploadInChunks);
router.post("/createEntry", redirectLogin, createPersonalDatabaseEntry);
router.get("/download/:username/:fileId", redirectLoginConditionally, downloadFile);

router.get("/sendFileToWebpage/:username/:fileId", validateLogin, sendFile);
router.get("/sendUsersFileListToWebpage/:username", validateLogin, sendSingleUsersFileList);

router.post("/delete/:fileId", redirectLogin, deleteFile);
router.post("/toggleVisibility/:fileId", redirectLogin, toggleVisibility);

module.exports = router;