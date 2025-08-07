const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannedIPSchema = new mongoose.Schema(
    {
        ip: {
            type: String,
            required: true,
            unique: true
        },
        reason: {
            type: String,
            default: "No reason specified",
        },
        bannedDate: {
            type: Date,
            default: Date.now
        }
    }
)

const BannedIP = mongoose.model('BannedIP', bannedIPSchema)

module.exports = BannedIP;