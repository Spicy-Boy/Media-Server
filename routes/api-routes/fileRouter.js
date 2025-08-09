const router = require("express").Router();

const {
    updateUserPermissionsAndFiles,
    validateLogin,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
 } = require("../../middlewares/authRemaster");

const {
    uploadInChunks,
    createPersonalDatabaseEntry,
    downloadFile,
    sendFile,
    deleteFile,
    toggleVisibility,
    sendSingleUsersFileList
} = require("../../controllers/fileController");

/* LOGIN AND PERMISSIONS VALIDATION BELOW THESE LINE!*/
// router.use(validateLogin);
// router.use(updateUserPermissionsAndFiles);

// /api/file/upload vv
router.post("/upload", validateLogin, uploadInChunks);
router.post("/createEntry", validateLogin, createPersonalDatabaseEntry);
router.get("/download/:username/:fileId", validateLogin,  downloadFile);

router.get("/sendFileToWebpage/:username/:fileId", validateLogin,  sendFile);
router.get("/sendUsersFileListToWebpage/:username", validateLogin, sendSingleUsersFileList);

router.post("/delete/:fileId", validateLogin, deleteFile);
router.post("/toggleVisibility/:fileId", validateLogin, toggleVisibility);

module.exports = router;