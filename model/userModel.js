const mongoose = require('mongoose');
const Schema =  mongoose.Schema
const userSchema = new Schema({

    username : {
        type : String,
        required : true,
        maxlength : 40,
        minlength : 1
    },
    password : {
        type : String ,
        required : true,
        maxlength : 256,
        minlength : 8

    },
    phoneNumber : {
        type : String ,
        required : false,
        maxlength : 15,
        minlength : 1

    },
    dateOfBirth : {
        type : Date,
        required : true
    },
    followed : {
        type : [String],
        default : []
    },
    followers : {
        type : [String],
        default : []

    },
    likedJitters : {
        type : [String],
        required : false,
        default : []

    },
    repostedJitters : {
        type : [String],
        required : false,
        default : []
    },
    publishedJitters:{
        type : [String],
        required : false,
        default : []
    }


},{collection:'jitter', timestamps: true})

userSchema.statics.login = async (username ,password) => {

    const filter = {
        $or: [
            { email: username },
            { userName: username }
          ],
        password: password
      };


      const findingUser = await users.find(filter);
      if(findingUser.length != 0){
        console.log('deee');

      }else{
        console.log('yanlis')
      };


};


const users = mongoose.model('users', userSchema);
module.exports = users;


