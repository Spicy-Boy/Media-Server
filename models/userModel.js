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
                    unique: true
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
        }
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User;