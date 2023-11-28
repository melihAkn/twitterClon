const {Schema} = require('mongoose');

const jitterSchema = new Schema ({

    jitterID : {
        type : String,
        require : true,
        minLength : 8,
        maxlength : 256
    },
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
    ownerOfJitterUsername : {
        type : String,
        minLength : 3,
        maxlength : 40,
        require : true
    },
    jitterComment : {
        type : [String],
    }

},{collection : 'jitters',timestamps : true});

const jitters = mongoose.model('jitter', jitterSchema);
module.exports = jitters;