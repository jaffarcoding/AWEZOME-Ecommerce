const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
const connectdatabase = ()=>{
    mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true}).then((data) =>{
        console.log(`mongose connected with server: ${data.connection.host}`);
    })
}

module.exports = connectdatabase;