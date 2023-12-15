const userModel = require('../model/userModel');
const jitterModel = require('../model/jittersModel');
const {hash,compare} = require('bcrypt');
const {verify} = require('jsonwebtoken');
require('dotenv').config();
const userSecretKey = process.env.JWT_USER_SECRET_KEY;
const loginPage = (req,res) => {
    res.render('./pages/login');
};

const registerPage = (req,res) => {
    res.render('./pages/register');

};

const mainPage = (req,res) => {
    res.render('./pages/mainPage');
}

const jitterPage = (req,res) => {
    res.render('./pages/jitterPage');



}

const login = async(req,res) => {
    console.log(req.body);
    try {
        const userToken = await userModel.login(req.body.username,req.body.password);
        console.log("token " + userToken);
        res.cookie('userToken',userToken,{maxAge : 3600000,httpOnly: true, path: '/',secure : false});
        res.redirect('/');
    } catch (error) {
        res.render('./pages/login', {message : error});
    };
};

const register = async(req,res) => {
    try {
          hash(req.body.password, 10).then(async function(hash) {
            console.log(hash);
            req.body.password = hash;
            const user = new userModel(req.body);
            const save = await user.save();
            console.log(save);
            if(user.createdAt){
                console.log("var");
                res.redirect('/login');
            }else{
                res.render('./pages/register');
            }
        });
        
    } catch (error) {
        res.status(500).render('./pages/register',{message : error});
    }


};

const getCommentID = async(req,res) => {
    try {
        const findJitter = await jitterModel.findOne({ownerOfJitterUsername : req.body.jitterOwnerUsername , jitterTextContent : req.body.jitterTextContent })
        res.status(200).send({jitterId : findJitter.id})
    } catch (error) {
        res.status(500).send(error)
    }
    


}
module.exports = {
    loginPage,
    registerPage,
    login,
    register,
    mainPage,
    getCommentID,
    jitterPage
}