const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const uploadedFileSchema = new mongoose.SchemaType({
    uploadNo: {
        type: Number,
        default: -1
    },
    fileName: {
        type: String,
        required: true
    },
    fileLocation: { //local url of uploaded file

    },
    uploader: {
        type: String
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});