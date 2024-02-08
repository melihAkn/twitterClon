const mongoose = require('mongoose');
require('dotenv').config();
const userSecretKey = process.env.JWT_USER_SECRET_KEY;
const {sign} = require('jsonwebtoken');
const {compare} = require('bcrypt');
const Schema =  mongoose.Schema;
const userSchema = new Schema({
    name : {
        type :String,
        required : true,
        maxlength : 40,
        minlength : 1

    },
    username : {
        type : String,
        required : true,
        maxlength : 40,
        minlength : 1,
        unique : true
    },
    password : {
        type : String ,
        required : true,
        maxlength : 256,
        minlength : 8

    },
    email : {
        type : String,
        required : true,
        maxlength : 128,
        minlength : 5,
        unique : true
       
    },
    phoneNumber : {
        type : String ,
        required : false,
        maxlength : 15,
        minlength : 1,
        unique : true

    },
    dateOfBirth : {
        type : Date,
        required : true
    },
    followed : {
        type : [Object],
        default : []
    },
    followers : {
        type : [Object],
        default : []

    },
    likedJitters : {
        type : [Object],
        required : false,
        default : []

    },
    repostedJitters : {
        type : [Object],
        required : false,
        default : []
    },
    publishedJitters:{
        type : [Object],
        required : false,
        default : []
    },
    notifications : {
        type :[Object],
        required : false,
        default : []
    }

},{collection:'users', timestamps: true})

userSchema.methods.generateToken =async (id) => {
    try {
        const userToken = sign(id,userSecretKey);
        return userToken;
    } catch (error) {
        return error;
    }
    
}

userSchema.statics.login = async (username ,password) => {
    try {
        const filter = {
            username : username,
            password
          };
          const user = await users.findOne({username : username})
          const token =compare(password,user.password)
          .then(async data => {
            filter.password = user.password
            if(data == true){
                const findingUser = await users.findOne(filter);
                if(findingUser.length != 0){
                  const userToken = sign({id : findingUser._id},userSecretKey)
                  return userToken
                }else{
                  return "username or password wrong"
                };
            }
            else{data == false}{
                return "username or password wrong"
            }
        
        })
          .catch(e => console.log(e))
          return token
    } catch (error) {
        return error
    }



};


const users = mongoose.model('users', userSchema);
module.exports = users;


