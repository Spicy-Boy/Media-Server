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
    manageUploadRequest
} = require("../controllers/suicuneController");

// /api/suicune/uploadSingle
router.post("/uploadSingle", redirectLogin, upload.single("uploaded_file"), uploadOneFile);

router.post("/uploadBusboy", redirectLogin, uploadWithBusboy);

router.post("/uploadXML", redirectLogin, uploadWithXMLHttpRequest);

router.post("/uploadXML-status", redirectLogin, manageUploadStatus);

router.post("/upload-request", redirectLogin, manageUploadRequest);

module.exports = router;