const mongoose=require('mongoose');
const multer=require('multer');
const Joi=require('joi');
const { func } = require('joi');

const UserDataSchema=new mongoose.Schema({
    UniqueID:{
        type:String,
        maxlength:12,
        minlength:6,
        required:true,
        validate:{
            validator:(data)=>{
                let RegExpData=data.match(/[a-z~@!&%#$^*()_+=[\]{}|,.;'` ?:-\\]/i);
                if(RegExpData) return false;
                else return true;
            },
            message:"no character and special character is allowed"
        }
    },
    UserName:{
        type:String,
        maxlength:12,
        minlength:6,
        required:true,
        validate:{
            validator:(data)=>{
                let RegExpData=data.match(/[0-9~@&%!#$^*()_+=[\]{}|,.;'`?:\\-]/i);
                if(RegExpData) return false;
                else return true; 
            },
            message:'no numeric and special character value allowed'
        }
    },
    UserImage:{
        ImageFileName:{
            type:String,
            required:true
        },
        ImageFileData:{
            type:Buffer,
            required:true
        }
    },
    UserCreatedDate:{
        type:Date,
        default:Date.now(),
    },
})

const UserDataSchemaModel=mongoose.model('UserData',UserDataSchema);

function UserDataSchemaValidate(userData)
{
    console.log(userData);
    const UserDataSchemaValidation=Joi.object({
        UniqueID:Joi.string()
                    .max(12)
                    .min(6)
                    .required(),
        UserName:Joi.string()
                    .max(12)
                    .min(6)
                    .required(),
        UserImageFile:Joi.any()
                         .required()
    });
    
    let validateData=UserDataSchemaValidation.validate(userData);
    console.log(validateData);
    return validateData;
}

function UserUniqueIDValidation(userData)
{
    const UserUniqueIDValidation=Joi.object({
        UniqueID:Joi.string()
                    .max(12)
                    .min(6)
                    .required(),
    });
    let validateData=UserUniqueIDValidation.validate(userData);
    console.log(validateData);
    return validateData;
}

module.exports.UserDataSchemaModel=UserDataSchemaModel;
module.exports.UserDataSchemaValidate=UserDataSchemaValidate;
module.exports.UserUniqueIDValidation=UserUniqueIDValidation