const userModel = require('../model/userModel');
const jittersModel = require('../model/jittersModel');
const {verify} = require('jsonwebtoken');
require('dotenv').config();
const userSecretKey = process.env.JWT_USER_SECRET_KEY;

const profilePageRender = (req,res) => {
    
    res.render('./pages/userProfilePage')
}

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
        const getAllJitters = await jittersModel.find({}).sort({likeCount : -1})
        res.status(200).send(getAllJitters);
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
};

const followedUsersJitters = async (req,res) => {
    
    try {
        const followedUsers = [];
        const followedUsersJitter = [];
        const token = req.token;
        const userFind = await userModel.findById(token.id);
        const findFollowedUsers = userFind.followed.forEach(e => {
            followedUsers.push(e.username);
        })
        for (let i = 0; i < followedUsers.length; i++) {
            const findingJitter = await jittersModel.find({ownerOfJitterUsername : followedUsers[i]});
            findingJitter.forEach(e => {
                followedUsersJitter.push(e);
            })
        };
        followedUsersJitter.sort((a, b) => b.likeCount - a.likeCount);
        res.send(followedUsersJitter);
    } catch (error) {
        console.error(error)
    }
};

const publishJitter = async (req,res) => {
    try {
        const token = req.token;
        const userFind = await userModel.findById(token.id);
        const tweets = {
            jitterTextContent : req.body.tweet,
            likeCount : 0,
            repostCount : 0,
            commentCount : 0
        };
        const addTweet =  userFind.publishedJitters.push(tweets);
        const saveTweet = await userFind.save();

        tweets.commentCount = {};
        tweets.ownerOfJitterUsername = userFind.username;
        const addJitter = new jittersModel(tweets);
        await addJitter.save();
        res.status(200).send({message : "tweet has added succesfully"});
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
};

const likeAndUnlikeJitter = async (req, res) => {
    let responseMessage = {
        message: ""
    };

    const jitter = {
        jitterTextContent: req.body.jitterText,
        ownerOfJitterUsername: req.body.jitterOwnerUsername
    };
    try {

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
                { $pull: { likedJitters: { jitterTextContent: jitter.jitterTextContent, ownerOfJitterUsername: jitter.ownerOfJitterUsername }}}
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

        res.status(200).send(responseMessage);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
const rejitter = async (req,res) => {
    const jitter = {
        jitterText : req.body.rejitterTweetText,
        username : req.body.rejitterTweetUsername
    };
    const token = req.token;
    try {
        const jitterFind = await jittersModel.findOne({jitterTextContent : jitter.jitterText , ownerOfJitterUsername : jitter.username});
        const findUser = await userModel.findById(token.id);
        const JitterExists =  findUser.repostedJitters.some(rejitter => rejitter.jitterText === jitter.jitterText && rejitter.username === jitter.username);
        if(JitterExists){
            res.send({message : "you are already rejitter this jitter if you want to remove rejittered list go to profile page",rejittered : false});
        }else{
            findUser.repostedJitters.push(jitter);
            await findUser.save();
            jitterFind.repostCount +=1;
            jitterFind.save();
            res.status(200).send({message : 'jitter rejitted',rejittered : true});
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({error});
    }
};

const removeRejitter = async (req,res) => {
    try {
        const token = req.token;
        const findUser = await userModel.findById(token.id)
        findUser.repostedJitters.pull()
        await userModel.updateOne(
            { _id: findUser._id },
            { $pull: { repostedJitters: { jitterText: req.body.jitterTextArray, username: req.body.rejitterTweetUsername }}}
        );
        const findJitter = await jittersModel.find({jitterTextContent : req.body.jitterTextArray , ownerOfJitterUsername : req.body.rejitterTweetUsername})
        findJitter[0].repostCount -=1
        await findJitter[0].save();
        res.status(200).send({message : "jitter rejittered"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error : error})
    }



};

const userFollow = async (req,res) => {
    try {
        //if user is followed all the belove code shouldnt work
        const token = req.token;
        //wants to follow
        const wantsToFollowUser = await userModel.findById(token.id);
        const ifExists =  wantsToFollowUser.followed.some(followed => followed.username === req.body.username);
        //if user already followed requested user dont follow again
        if(ifExists){
            res.send({message :"user already followed"});
        }else if(wantsToFollowUser.username == req.body.username){
            res.send({message : `you can't follow yourself `});
        }
        else{
        wantsToFollowUser.followed.push({username : req.body.username});
        wantsToFollowUser.save();
        const beingFollowedUser = await userModel.findOne({username : req.body.username});
        beingFollowedUser.followers.push({username : wantsToFollowUser.username});
        beingFollowedUser.save();

        res.status(200).send({message : "user followed"});
        }
        
    } catch (error) {
        res.status(500).send(error);
    }



};

const unfollowUser = async(req,res) => {
    try {
        //user to unfollow
        const wantsToUnfollowedUser = await userModel.findOne({username : req.body.thisUserShouldBeUnfollow});
        //user who wants to unfollow
        const wantsToUnfollowUser = await userModel.find({username : req.body.username});
        console.log(wantsToUnfollowedUser)
        //user unfollow 
        await userModel.updateOne(
            { _id: wantsToUnfollowUser[0]._id },
            { $pull: { followed: { username: req.body.thisUserShouldBeUnfollow }}}
        );
        //unfollowed user followers list pull
        await userModel.updateOne(
            { _id: wantsToUnfollowedUser._id },
            { $pull: { followers: { username: wantsToUnfollowUser[0].username } } }
        );

        res.send({message : 'user unfollowed'});
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }

};

const addComment = async(req,res) => {
    try {
        const token = req.token;
        //comment owner
        const findUser = await userModel.findById(token.id);
        //comment data
        const comment = {
            ownerOfCommnet : findUser.username,
            commnetText : req.body.comment
        };
        //add comment
        const findJitter = await jittersModel.findById(req.body.jitterId);
        findJitter.jitterComment.push(comment);
        findJitter.save();

        res.status(200).send({message : 'comment added succesfully'});
    } catch (error) {
        console.error(error);
        res.status(500).send({error});
    }

};

const updateComment = async(req,res) => {


};

const deleteComment = async(req,res) => {


    
}
const getUsername = async(req,res) => {
    try {
        const token = req.token;
        const userFind = await userModel.findById(token.id);
        res.status(200).send({username : userFind.username});
    } catch (error) {
       res.status(500).send({error});
    }
};

const getUserInfos = async(req,res) => {
    try {
        const userFind = await userModel.find({username : req.body.username})
        .select("-_id -email -password -phoneNumber -createdAt -updatedAt -__v");
        res.status(200).send(userFind[0]);
    } catch (error) {
        if(error.message == "jwt must be provided"){
            console.log(error)
            const errorObject = {
                error : "JsonWebTokenError",
                message : "jwt must be provided"
            }
            res.status(401).json(errorObject)
        }else{
            console.log(error);
            res.send({error});
        }
       
    }
};

const getUserRejitteredJitters = async (req,res) => {
    try {
        const rejitteredJitters = [];
        for (const data of req.body) {
            const findRejitters = await jittersModel.find({
              jitterTextContent: data.jitterText,
              ownerOfJitterUsername: data.username
            })
            .select("-_id -createdAt -updatedAt -__v");
            rejitteredJitters.push(findRejitters[0]);
          }
        res.status(200).send(rejitteredJitters);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const getUserLikedJitters = async (req,res) => {
    try {
        const likedJitters = [];
        for (const data of req.body) {
            const findLiked = await jittersModel.find({
              jitterTextContent: data.jitterTextContent,
              ownerOfJitterUsername: data.ownerOfJitterUsername
            })
        .select("-_id -createdAt -updatedAt -__v");
        likedJitters.push(findLiked[0]);
    }
    res.status(200).send(likedJitters);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const getUserFollowedUsers = async (req,res) => {
    try {
        const userFollowedUsers = [];
        console.log(req.body);
        for (const data of req.body) {
            const findUser = await userModel.find({
              username: data.username,
            })
        .select("-_id -password -email -phoneNumber -dateOfBirth -likedJitters -repostedJitters -publishedJitters -createdAt -updatedAt -__v");
        userFollowedUsers.push(findUser[0]);
    }
    console.log(userFollowedUsers);
    res.status(200).send(userFollowedUsers);

    } catch (error) {
        res.status(500).send(error);
    }


};



const logout = (req,res) => {
    try {
        res.clearCookie('userToken',{path : '/'});
    res.status(200).send({message : "token deleted"});
    } catch (error) {
        console.log(error);
    }
    
};
module.exports = {
    profilePageRender,
    getUserToken,
    publishJitter,
    getAllJitters,
    logout,
    likeAndUnlikeJitter,
    userFollow,
    unfollowUser,
    addComment,
    rejitter,
    removeRejitter,
    followedUsersJitters,
    getUsername,
    getUserInfos,
    getUserRejitteredJitters,
    getUserLikedJitters,
    getUserFollowedUsers,
    
};
