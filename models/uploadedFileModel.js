const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const uploadedFileSchema = new mongoose.SchemaType({
    uploadNo: {
        type: Number,
        default: -1
    },
    name: {
        type: String,
        required: true
    },
    location: String,
    size: { //in bytes
        type: Number,
        required: true
    },
    uploader: { //the uploader is referenced by their object id in the DB
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    uploaderString: String, //just in case lol
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema);