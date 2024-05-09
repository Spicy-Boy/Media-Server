const mongoose = require('mongoose');

function connectToMongoDB(){
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('MONGODB CONNECTED')
        })
        .catch((e) => {
            console.error(e);
        });
};

module.exports = connectToMongoDB;