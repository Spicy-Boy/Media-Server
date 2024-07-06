// NOT USED CURRENTLY, for reference later
const mongoose = require("mongoose");

const fileNoSchema = new mongoose.Schema({
    number: {
        type: Number,
        default: 0,
        required: true
    }
});

const FileNo = mongoose.model("fileNo", fileNoSchema);

module.exports = FileNo;