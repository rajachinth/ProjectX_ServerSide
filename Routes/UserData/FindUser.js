const express=require('express');
const router=express.Router();
const {UserUniqueIDValidation,UserDataSchemaModel}=require('../../Models/UserData/UserData');

router.get('/:UniqueID',async(request,response)=>{ 
    const {error}=UserUniqueIDValidation({UniqueID:request.params.UniqueID});
    if(error) return response.status(400).send(`Invalid UniqueID:${error}`);
    let queryData=await UserDataSchemaModel.findOne({UniqueID:request.params.UniqueID});
    if(!queryData) return response.status(400).send('No UniqueID found in DataBase');
    console.log(queryData);
    response.send(queryData);
});

module.exports=router;