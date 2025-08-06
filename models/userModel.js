const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        files: [
            {
                fileId: { //each file is given a unique uuid to identify it
                    type: String,
                    required: true,
                    default: uuidv4,
                    // unique: true, //this doesnt work how I thought it would!
                },
                name: String,
                size: Number, //in bytes
                location: String, //a file path 
                //file location is saved just in case the .env mail delivery location changes. This keeps a record of where the file was uploaded originally to aid in future recovery efforts
                date: {
                    type: Date,
                    default: Date.now
                },
                isPublic: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        created: { 
            type: Date,
            default: Date.now
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isUploader: {
            //uploaders have permission to upload to their personal drive. If false, uploading is disabled
            type: Boolean,
            default: false
        },
        isCurator: {
            //curators can manage public-facing content and transport uploads from user drives' to public-facing content pages
            type: Boolean,
            default: false
        },
        isFrozen: {
            //frozen users are prevented (via middleware) from performing any requests whatsoever... Gotta figure that out lol
            type: Boolean,
            default: false
        }
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User;