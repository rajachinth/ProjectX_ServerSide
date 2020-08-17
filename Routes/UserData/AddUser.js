const multer=require('multer');
const express=require('express');
const sharp=require('sharp');
const router=express.Router();
const {UserDataSchemaModel,UserDataSchemaValidate}=require('../../Models/UserData/UserData');

const upload=multer({
    limits:{ fileSize:'500000' },
    fileFilter(request,file,callback)
    {
        if(file.originalname.match(/.(jpeg|png|jpg|gif)/i)) callback(null,true);
        else callback(new Error('only .jpeg|.png|.jpg|.gif files allowed'));
    }
});

router.post('/',upload.single('UserImageFile'),async(request,response)=>{
    let {error}=UserDataSchemaValidate({UniqueID:request.body.UniqueID,
                                        UserName:request.body.UserName,
                                        UserImageFile:request.file});
    if(error) return response.status(400).send(error.message);
    if(request.file.size > 500000) return response.status(400).send('only files less than 500KB allowed');
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
    const queryData=await UserDataSchemaModel.findOne({UniqueID:request.body.UniqueID},'_id');
    if(queryData) return response.status(409).send('duplicate ID found in DataBase');
    try
    {
        await new UserDataSchemaModel({
            UniqueID:request.body.UniqueID,
            UserName:request.body.UserName,
            UserImage:{
                ImageFileName:fileName,
                ImageFileData:sharpImage
            }
        }).save();
    }
    catch(exception)
    {
        return response.status(422).send(exception);
    }
    response.status(200).send('new user account created successfuly');
},(error,request,response,next)=>{
    if(error) return response.status(409).send(error.message);
    next();
});

module.exports=router;