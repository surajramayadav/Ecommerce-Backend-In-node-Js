
const mongoose = require('mongoose');
const { DEV, DB_URI_DEV, DB_URI_PRO } = require('./config');

const ConnectDatabase = () => {

    const DB = DEV ? DB_URI_DEV : DB_URI_PRO

    mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((data) => {
            console.log(`Mongodb connected with server : ${data.connection.host}`);
        })
}
module.exports = ConnectDatabase