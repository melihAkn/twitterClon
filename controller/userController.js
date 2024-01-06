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
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token,userSecretKey);
        const getAllTweet = await jittersModel.find({});
        res.status(200).send(getAllTweet);
        
    } catch (error) {
        res.status(500).send(error);
    }
}

const followedUsersJitters = async (req,res) => {
    
    const token = req.cookies.userToken;
    try {
        const followedUsers = []
        const followedUsersJitter = []
        const tokenVerify = verify(token,userSecretKey);
        const userFind = await userModel.findById(tokenVerify.id);
        const findFollowedUsers = userFind.followed.forEach(e => {
            followedUsers.push(e.username)
        })
        console.log(followedUsers)
        for (let i = 0; i < followedUsers.length; i++) {
            const findingJitter = await jittersModel.find({ownerOfJitterUsername : followedUsers[i]});
            findingJitter.forEach(e => {
                followedUsersJitter.push(e);
            })
        };
        console.log(followedUsersJitter)
        res.send(followedUsersJitter)
    } catch (error) {
        console.error(error)
    }
}
//username jitterTextArray jitterOwnerUsername

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
    console.log(jitter)
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
const rejitter = async (req,res) => {
    const jitter = {
        jitterText : req.body.rejitterTweetText,
        username : req.body.rejitterTweetUsername
    }
    const token = req.cookies.userToken
    try {
        const tokenFind = verify(token,userSecretKey)
        const jitterFind = await jittersModel.findOne({jitterTextContent : jitter.jitterText , ownerOfJitterUsername : jitter.username})
        const findUser = await userModel.findById(tokenFind.id)
        const JitterExists =  findUser.repostedJitters.some(rejitter => rejitter.jitterText === jitter.jitterText && rejitter.username === jitter.username)
        if(JitterExists){
            res.send({message : "you are already rejitter this jitter or if you want to remove rejittered list go to profile page",rejittered : false})
        }else{
            findUser.repostedJitters.push(jitter)
            await findUser.save()
            jitterFind.repostCount +=1
            jitterFind.save()
            res.status(200).send({message : 'jitter rejitted',rejittered : true})
        }

    } catch (error) {
        console.error(error)
        res.status(500).send({error})
    }
}

const removeRejitter = (req,res) => {

    try {
        
    } catch (error) {
        
    }



}

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
        if(ifExists){
            res.send({message :"user already followed"})
        }else if(wantsToFollowUser.username == req.body.username){
            res.send({message : `you can't follow yourself `})
        }
        else{
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
const getUsername = async(req,res) => {
    try {
        const token = req.cookies.userToken
        const tokenVerify = verify(token,userSecretKey)
        const userFind = await userModel.findById(tokenVerify.id)
        res.status(200).send({username : userFind.username})
    } catch (error) {
       res.status(500).send({error}) 
    }
}

const getUserInfos = async(req,res) => {
    try {
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token,userSecretKey);
        const userFind = await userModel.findById(tokenIsValid.id)
        .select("-_id -email -password -phoneNumber -createdAt -updatedAt -__v")
        
        res.status(200).send(userFind)
    } catch (error) {
        console.log(error)
        res.send({error})
    }
}

const getUserRejitteredJitters = async (req,res) => {
    try {
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token,userSecretKey);
        console.log(req.body)
        const rejitteredJitters = []
        for (const data of req.body) {
            const findRejitters = await jittersModel.find({
              jitterTextContent: data.jitterText,
              ownerOfJitterUsername: data.username
            })
            .select("-_id -createdAt -updatedAt -__v")
            rejitteredJitters.push(findRejitters[0]);
          }
          console.log(rejitteredJitters)
        res.status(200).send(rejitteredJitters)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const getUserLikedJitters = async (req,res) => {
    try {
        const token = req.cookies.userToken;
        const tokenIsValid = verify(token,userSecretKey);
        console.log(req.body)
        const likedJitters = []
        for (const data of req.body) {
            const findLiked = await jittersModel.find({
              jitterTextContent: data.jitterTextContent,
              ownerOfJitterUsername: data.ownerOfJitterUsername
            })
        .select("-_id -createdAt -updatedAt -__v")
        likedJitters.push(findLiked[0])
    }
    console.log(likedJitters)
    res.status(200).send(likedJitters)

    } catch (error) {
        console.log(error)
        res.status(500).send(error) 
    }
}

const getUserFollowedUsers = async (req,res) => {
    try {
        const token = req.cookies.userToken
        const tokenVerify = verify(token,userSecretKey)
        const userFollowedUsers = []
        console.log(req.body)
        for (const data of req.body) {
            const findUser = await userModel.find({
              username: data.username,
            })
        .select("-_id -password -email -phoneNumber -dateOfBirth -likedJitters -repostedJitters -publishedJitters -createdAt -updatedAt -__v")
        userFollowedUsers.push(findUser[0])
    }
    console.log(userFollowedUsers)
    res.status(200).send(userFollowedUsers)

    } catch (error) {
        res.status(500).send(error)
    }


}

const getUserFollowerUsers = async (req,res) => {
    try {
        



    } catch (error) {
        
    }


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
    getUserFollowerUsers
    
}
