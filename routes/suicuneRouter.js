const router = require("express").Router();

//summon multer vv and its useful upload function
const upload = require("../middlewares/multer");

const {
    redirectLogin
 } = require("../middlewares/authMiddleware");

const {
    uploadOneFile,
    uploadWithBusboy
} = require("../controllers/suicuneController");

// /api/suicune/uploadSingle
router.post("/uploadSingle", redirectLogin, upload.single("uploaded_file"), uploadOneFile);

router.post("/uploadBusboy", redirectLogin, uploadWithBusboy)

module.exports = router;