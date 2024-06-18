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
    manageUpload,
    simpleUpload
} = require("../controllers/suicuneController");

// /api/suicune/uploadSingle
router.post("/uploadSingle", redirectLogin, upload.single("uploaded_file"), uploadOneFile);

router.post("/uploadBusboy", redirectLogin, uploadWithBusboy);

// router.post("/uploadXML", redirectLogin, uploadWithXMLHttpRequest);
/* vvv routes for the Before Semicolon Multi-File Uploader tut
https://www.youtube.com/watch?v=R2AD1h0iQAw
*/
router.post("/upload-status", redirectLogin, manageUploadStatus);
router.post("/upload-request", redirectLogin, manageUploadRequest);
router.post("/upload", redirectLogin, manageUpload);

/* vvv routes for Aaron's simplified version, rewritten scratch 

*/
router.post("/simpleUpload", redirectLogin, simpleUpload);


module.exports = router;