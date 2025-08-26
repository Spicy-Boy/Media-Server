const router = require("express").Router();
const uploadCommentImage = require("../../middlewares/multerForComments");

const {
    updateUserPermissionsAndFiles,
    validateLogin,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
    validateLoginConditionallyForFile,
 } = require("../../middlewares/authRemaster");

const {
    uploadInChunks,
    createPersonalDatabaseEntry,
    downloadFile,
    sendFile,
    deleteFile,
    toggleVisibility,
    sendSingleUsersFileList,
    addCommentToFile,
    sendCommentFileByIndex
} = require("../../controllers/fileController");

/* LOGIN AND PERMISSIONS VALIDATION BELOW THESE LINE!*/
// router.use(validateLogin);
// router.use(updateUserPermissionsAndFiles);

// /api/file/upload vv
router.get("/download/:username/:fileId", validateLoginConditionallyForFile, downloadFile);

router.post("/upload", validateLogin, updateUserPermissionsAndFiles, validateIsUploader, uploadInChunks);
router.post("/createEntry", validateLogin, updateUserPermissionsAndFiles, validateIsUploader, createPersonalDatabaseEntry);

router.post("/addComment/:username/:fileId", validateLogin, updateUserPermissionsAndFiles, validateIsUploader, uploadCommentImage.single('uploaded_file'), addCommentToFile);
router.get("/sendCommentFileByIndex/:username/:fileId/:index", validateLoginConditionallyForFile, sendCommentFileByIndex);

router.get("/sendFileToWebpage/:username/:fileId", validateLoginConditionallyForFile, sendFile);

router.get("/sendUsersFileListToWebpage/:username", validateLogin, sendSingleUsersFileList);

router.post("/delete/:fileId", validateLogin, deleteFile);
router.post("/toggleVisibility/:fileId", validateLogin, toggleVisibility);

module.exports = router;