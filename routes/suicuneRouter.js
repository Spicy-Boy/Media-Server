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


// !!! vvv DEPRECATED route using multer
// /api/suicune/uploadSingle
// router.post("/uploadSingle", redirectLogin, upload.single("uploaded_file"), uploadOneFile);

// !!! vvv DEPRECATED ROUTES, for learning and testing :)
//vv first busboy test
// router.post("/uploadBusboy", redirectLogin, uploadWithBusboy);
//vv first xmlhttp test
// router.post("/uploadXML", redirectLogin, uploadWithXMLHttpRequest);
/* vvv routes for the Before Semicolon Multi-File Uploader tutorial
https://www.youtube.com/watch?v=R2AD1h0iQAw
vv
*/
// router.post("/upload-status", redirectLogin, manageUploadStatus);
// router.post("/upload-request", redirectLogin, manageUploadRequest);
// router.post("/upload", redirectLogin, manageUpload);

/* vvv routes for Aaron's simplified version, rewritten scratch 

*/
router.post("/simpleUpload", redirectLogin, simpleUpload);

module.exports = router;