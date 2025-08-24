const multer = require("multer");

//MULTER middleware
//used for donation uploading, simple as!!!
const storage = multer.diskStorage({
    destination: (req, file, cb) =>
    {
        const fileLocation = req.body.location;
        cb(null, "public/images/"+fileLocation);
        // cb(null, "public/uploads/");
    },
    filename: (req, file, cb) =>
    {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

module.exports = upload;