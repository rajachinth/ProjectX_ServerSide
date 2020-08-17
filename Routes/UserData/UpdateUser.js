const multer=require('multer');
const express=require('express');
const sharp=require('sharp');
const router=express.Router();
const {UserDataSchemaModel,
       UserDataSchemaValidate,
       UserUniqueIDValidation}=require('../../Models/UserData/UserData');

const upload=multer({
    limits:{ fileSize:'500000' },
    fileFilter(request,file,callback)
    {
        if(file.originalname.match(/.(jpeg|png|jpg|gif)/i)) callback(null,true);
        else callback(new Error('only .jpeg|.png|.jpg|.gif files allowed'));
    }
});

router.put('/:UniqueID',upload.single('UserImageFile'),async(request,response)=>{
    if(request.file.size > 500000) 
        return response.status(400).send('only files less than 500KB allowed');
    let validateID=UserUniqueIDValidation({UniqueID:request.params.UniqueID});
    if(validateID.error) response.status(400).send('Invalid UniqueID');
    let {error}=UserDataSchemaValidate({UniqueID:request.body.UniqueID,
                                        UserName:request.body.UserName,
                                        UserImageFile:request.file});
    if(error) return response.status(400).send(error.message);
    let userQueryData=await UserDataSchemaModel.findOne({UniqueID:request.params.UniqueID},'UniqueID');
    let newUserQueryData=await UserDataSchemaModel.findOne({UniqueID:request.body.UniqueID},'UniqueID');
    console.log(userQueryData);
    if(userQueryData)
        {
            if(userQueryData.UniqueID == request.body.UniqueID)
                return response.status(400).send('cannot update with the current same UniqueID');
        }
    else if(!userQueryData)
        return response.status(400).send('UniqueID doesnt exist in DataBase to update');
    else if(newUserQueryData)
        return response.status(400).send('new UniqueID is already in use by other user');
    const fileName=request.file.originalname;
    let sharpImage;
    await sharp(request.file.buffer)
                            .resize({width:500,
                                    height:500,
                                    withoutEnlargement:true,
                                    fastShrinkOnLoad:true,
                                    background:{r:255,g:255,b:255},
                                    fit:"cover" })
                            .jpeg()
                            .toBuffer()
                            .then((data)=>{ sharpImage=data })
                            .catch((error)=>{return response.status(409).send(`un-processable error occured while sharping the image:${error}`)});
    await UserDataSchemaModel.findOneAndUpdate({UniqueID:request.params.UniqueID},
                              {$set:{
                                UniqueID:request.body.UniqueID,
                                UserName:request.body.UserName,
                                UserImage:{
                                    ImageFileName:fileName,
                                    ImageFileData:sharpImage
                                }
                              }},{new:true,runValidators: true},(error,data)=>{
                                  if(error) return response.status(409).send(`${error}`);
                                  response.status(200).send('User Data updated successfuly');
                              });
},(error,request,response,next)=>{
    if(error) return response.status(409).send(error.message);
    next();
});

module.exports=router;