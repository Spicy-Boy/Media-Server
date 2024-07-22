const multer = require("multer");

//MULTER middleware
//used for donation uploading, simple as!!!
const storage = multer.diskStorage({
    destination: (req, file, cb) =>
    {
        cb(null, "public/images/donation-images");
        // cb(null, "public/uploads/");
    },
    filename: (req, file, cb) =>
    {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

module.exports = upload;