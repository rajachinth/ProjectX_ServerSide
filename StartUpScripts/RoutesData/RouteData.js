const addUser=require('../../Routes/UserData/AddUser');
const updateUser=require('../../Routes/UserData/UpdateUser');
const userImage=require('../../Routes/UserData/UserImage');
const findUser=require('../../Routes/UserData/FindUser');
const errorHandler=require('../../Middlewares/ErrorHandler/ErrorHandler');

const RouteData = (app) => {
    app.use('/addUser',addUser),
    app.use('/updateUser',updateUser),
    app.use('/userImage',userImage),
    app.use('/findUser',findUser)
    app.use(errorHandler);
}

module.exports=RouteData;