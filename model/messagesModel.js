const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();
const Schema =  mongoose.Schema
const messagesSchema = new Schema ({
    senderID : {
        type : ObjectId,
        required : true

    },
    receiverID : {
        type : ObjectId,
        required : true
    },
    messageContent : {
        type : String,
        minlength : 1,
        maxlength : 255
    }

},{collection : 'Usermessages',timestamps : true})
const Usermessages = mongoose.model('Usermessages', messagesSchema);
module.exports = Usermessages;