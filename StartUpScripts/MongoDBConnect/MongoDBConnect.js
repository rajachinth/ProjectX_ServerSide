const mongoose = require('mongoose');
const config=require('config');

const MongoDBConnect = () => {
    mongoose.connect(config.get('DB_Config'))
        .then(()=>{console.log('DataBase Connection Succesfull')})
        .catch(()=>{console.log('DataBase Connection Error')});
}

module.exports=MongoDBConnect;
