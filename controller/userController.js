const userModel = require('../model/userModel');
const jittersModel = require('../model/jittersModel');
const {verify} = require('jsonwebtoken');
require('dotenv').config();
const userSecretKey = process.env.JWT_USER_SECRET_KEY;


const getUserToken = (req,res) => {
    try {
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token,userSecretKey);
        if(tokenIsValid){
            res.send({token : token, tokenFound : true});
        }
         
    } catch (error) {
        res.status(401).redirect("/login");
    }

};

const getAllJitters = async(req,res) => {
    try {
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token,userSecretKey);
        const getAllTweet = await jittersModel.find({});
        res.status(200).send(getAllTweet);
        
    } catch (error) {
        res.status(500).send(error);
    }
}

const publishJitter = async (req,res) => {
    try {
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token,userSecretKey);
        const userFind = await userModel.findById(tokenIsValid.id)
        const tweets = {
            jitterTextContent : req.body.tweet,
            likeCount : 0,
            repostCount : 0,
            commentCount : 0
        }
        const addTweet =  userFind.publishedJitters.push(tweets)
        const saveTweet = await userFind.save()

        tweets.commentCount = {}
        tweets.ownerOfJitterUsername = userFind.username
        const addJitter = new jittersModel(tweets)
        await addJitter.save()
        res.status(200).send({message : "tweet has added succesfully"});
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}

const likeAndUnlikeJitter = async (req, res) => {
    let responseMessage = {
        message: ""
    };

    const jitter = {
        jitterTextContent: req.body.jitterText,
        ownerOfJitterUsername: req.body.jitterOwnerUsername
    };

    try {
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token, userSecretKey);

        const findUser = await userModel.findOne({ username: req.body.jitterOwnerUsername });

        const userLikedJitterArray = [];

        findUser.likedJitters.forEach((e) => {
            if (jitter.jitterTextContent === e.jitterTextContent && jitter.ownerOfJitterUsername === e.ownerOfJitterUsername) {
                userLikedJitterArray.push(e);
            }
        });

        if (userLikedJitterArray.length > 0) {
            await userModel.updateOne(
                { _id: findUser._id },
                { $pull: { likedJitters: { jitterTextContent: jitter.jitterTextContent, ownerOfJitterUsername: jitter.ownerOfJitterUsername } } }
            );

            const findJitter = await jittersModel.findOne(jitter);
            if (findJitter) {
                findJitter.likeCount -= 1;
                await findJitter.save();
            }

            responseMessage.message = "jitter has unliked";
        } else {
            findUser.likedJitters.push(jitter);
            await findUser.save();

            const findJitter = await jittersModel.findOne(jitter);
            if (findJitter) {
                findJitter.likeCount += 1;
                await findJitter.save();
            }

            responseMessage.message = "jitter has liked";
        }

        console.log(responseMessage);
        res.status(200).send(responseMessage);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const userFollow = async (req,res) => {
    try {
        //if user is followed all the belove code shouldnt work
        console.log(req.body)
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token,userSecretKey);
        //wants to follow
        const wantsToFollowUser = await userModel.findById(tokenIsValid.id)
        const ifExists =  wantsToFollowUser.followed.some(followed => followed.username === req.body.username);
        //if user already followed requested user dont follow again
        if(ifExists || wantsToFollowUser.username == req.body.username){
            res.send({message : `you can't follow yourself or user already followed`})
        }else{
        wantsToFollowUser.followed.push({username : req.body.username})
        wantsToFollowUser.save()
        const beingFollowedUser = await userModel.findOne({username : req.body.username})
        beingFollowedUser.followers.push({username : wantsToFollowUser.username})
        beingFollowedUser.save()

        res.status(200).send({message : "user followed"})
        }

        
    } catch (error) {
        res.status(500).send(error)
    }



}

const unfollowUser = async(req,res) => {
    try {
        console.log(req.body)
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token,userSecretKey);
        //user to unfollow
        const wantsToUnfollowedUser = await userModel.findOne({username : req.body.username})
        //user who wants to unfollow
        const wantsToUnfollowUser = await userModel.findById(tokenIsValid.id)
        
        await userModel.updateOne(
            { _id: tokenIsValid.id },
            { $pull: { followed: { username: req.body.username } } }
        );
        
        await userModel.updateOne(
            { _id: wantsToUnfollowedUser._id },
            { $pull: { followers: { username: wantsToUnfollowUser.username } } }
        );

        res.send({message : 'maybe this works'})
    } catch (error) {
        res.status(500).send(error)
    }

}

const addComment = async(req,res) => {
    try {
        console.log(req.body)
        const token = req.cookies.userToken
        const tokenIsValid = verify(token,userSecretKey);
        //comment owner
        const findUser = await userModel.findById(tokenIsValid.id)
        //comment data
        const comment = {
            ownerOfCommnet : findUser.username,
            commnetText : req.body.comment
        }
        //add comment
        const findJitter = await jittersModel.findById(req.body.jitterId)
        findJitter.jitterComment.push(comment)
        findJitter.save()

        res.status(200).send({message : 'comment added succesfully'}) 
    } catch (error) {
        console.error(error)
        res.status(500).send({error})
    }

}

const updateComment = async(req,res) => {


}

const deleteComment = async(req,res) => {


    
}

const logout = (req,res) => {
    try {
        res.clearCookie('userToken',{path : '/'});
    res.status(200).send({message : "token deleted"});
    } catch (error) {
        console.log(error);
    }
    
}
module.exports = {
    getUserToken,
    publishJitter,
    getAllJitters,
    logout,
    likeAndUnlikeJitter,
    userFollow,
    unfollowUser,
    addComment
    
}
