const mongoose = require('mongoose');
require('dotenv').config();
const Schema =  mongoose.Schema
const jitterSchema = new Schema ({

    jitterTextContent : {
        type : String,
        minLength : 1,
        maxlength : 150,
        require : true,
    },
    likeCount : {
        type : String,
        minLength : 1,
        maxlength : 10,
        default : "0"
    },
    repostCount : {
        type : String,
        minLength : 1,
        maxlength : 10,
        default : "0"
    },
    jitterComment : {
        type : [Object],
        require : false,
        default : []
    },
    ownerOfJitterUsername : {
        type : String,
        minLength : 3,
        maxlength : 40,
        require : true
    }


},{collection : 'jitters',timestamps : true});

const jitters = mongoose.model('jitters', jitterSchema);
module.exports = jitters;