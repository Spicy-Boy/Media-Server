const multer = require("multer");

//MULTER middleware, choose destination and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) =>
    {
        cb(null, process.env.MAIL_DELIVERY_LOCATION);
        // cb(null, "public/uploads/");
    },
    filename: (req, file, cb) =>
    {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

module.exports = upload;