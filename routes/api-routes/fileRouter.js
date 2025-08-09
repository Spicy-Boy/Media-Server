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
router.use(validateLogin);
router.use(updateUserPermissionsAndFiles);

// /api/file/upload vv
router.post("/upload", uploadInChunks);
router.post("/createEntry", createPersonalDatabaseEntry);
router.get("/download/:username/:fileId", downloadFile);

router.get("/sendFileToWebpage/:username/:fileId", sendFile);
router.get("/sendUsersFileListToWebpage/:username", sendSingleUsersFileList);

router.post("/delete/:fileId", deleteFile);
router.post("/toggleVisibility/:fileId", toggleVisibility);

module.exports = router;