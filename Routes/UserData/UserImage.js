const express=require('express');
const router=express.Router();
const {UserUniqueIDValidation,UserDataSchemaModel}=require('../../Models/UserData/UserData');

router.get('/:UniqueID',async(request,response)=>{
    const {error}=UserUniqueIDValidation({UniqueID:request.params.UniqueID});
    if(error) return response.status(400).send(`Invalid UniqueID:${error.message}`);
    let queryData=await UserDataSchemaModel.findOne({UniqueID:request.params.UniqueID},'UserImage.ImageFileData');
    if(!queryData) return response.status(400).send('No data found for this UniqueID');
    console.log(queryData.UserImage.ImageFileData);
    response.set('Content-Type','image/jpeg').send(queryData.UserImage.ImageFileData);
});

module.exports=router;