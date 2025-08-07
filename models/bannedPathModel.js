const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannedPathSchema = new mongoose.Schema(
    {
        path: {
            type: String,
            required: true,
            unique: true
        },
        reason: {
            type: String,
            default: "Probably an evil path tbh",
        },
        bannedDate: {
            type: Date,
            default: Date.now
        }
    }
)

const BannedPath = mongoose.model('BannedPath', bannedPathSchema)

module.exports = BannedPath;