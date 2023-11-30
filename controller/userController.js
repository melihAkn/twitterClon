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
        res.status(401).redirect("/login")
    }



};

module.exports = {
    getUserToken
}
