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
            // Kullanıcının beğendiği jitter zaten varsa, onu silelim
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
            // Kullanıcının beğendiği jitter yoksa, ekleyelim
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
    likeAndUnlikeJitter
}
