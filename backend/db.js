const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/iNotebook'
mongoose.set('strictQuery', false);
const connectToMongo = ()=>{
    // mongoose.createConnection(mongoURI,()=>{
    //     console.log("Connected to mongoose successfully")
    // })
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
        console.log("Connected to mongoose successfully")
    })
}

module.exports = connectToMongo;


