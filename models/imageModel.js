const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const imageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        username: { //of person that uploaded image
            type: String,
            required: true,
        },
        imgId: {
            type: String,
            required: true,
            default: uuidv4
        },
        imgSize: Number,
        imgWidth: Number,
        imgHeight: Number,
        imgDate: {
            type: Date,
            required: true
        },
        imgFileType: String,
        location: String, //a file path 
        //file location is saved just in case the .env mail delivery location changes. This keeps a record of where the file was uploaded originally to aid in future recovery efforts
    }
)

const Image = mongoose.model('Image', imageSchema)

module.exports = Image;