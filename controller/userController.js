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
    logout
}
