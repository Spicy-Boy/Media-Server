const mongoose = require('mongoose')

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
                fileId: {
                    type: Schema.Types.ObjectId,
                    ref: 'uploadedFile'
                },
                name: String,
                size: Number //in bytes
            }
        ]

    }
)

const User = mongoose.model('User', userSchema)

module.exports = User