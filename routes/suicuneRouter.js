const router = require("express").Router();

//summon multer vv and its useful upload function
const upload = require("../middlewares/multer");

const {
    redirectLogin
 } = require("../middlewares/authMiddleware");

const {
    uploadOneFile,
    uploadWithBusboy,
    uploadWithXMLHttpRequest,
    manageUploadStatus,
    manageUploadRequest,
    manageUpload
} = require("../controllers/suicuneController");

// /api/suicune/uploadSingle
router.post("/uploadSingle", redirectLogin, upload.single("uploaded_file"), uploadOneFile);

router.post("/uploadBusboy", redirectLogin, uploadWithBusboy);

router.post("/uploadXML", redirectLogin, uploadWithXMLHttpRequest);

router.post("/upload-status", redirectLogin, manageUploadStatus);
router.post("/upload-request", redirectLogin, manageUploadRequest);
router.post("/upload", redirectLogin, manageUpload);

module.exports = router;