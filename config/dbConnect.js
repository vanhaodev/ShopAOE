//KẾT NỐI ĐẾN MONGODB

const mongoose = require('mongoose');

function connect(){
    try {
        mongoose.connect('mongodb://localhost:27017/aoeshop');
        useCreateIndex: true,
        console.log('Kết nối ok!');
    } catch (error) {
        console.log('Kết nối thất bại!');
    }

}
module.exports = {connect};
//mongodb+srv://nvh2001:<password>@cluster0.fcfku.mongodb.net/test
//mongodb://localhost:27017/db