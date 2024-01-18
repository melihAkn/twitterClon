const {verify} = require('jsonwebtoken');
require('dotenv').config();
const jwtSecretKey = process.env.JWT_USER_SECRET_KEY;
const jwtControl =(req,res,next) => {
    const token =  req.cookies.userToken;
   const tokenIsValid = verify(token,jwtSecretKey)
   req.token = tokenIsValid
    next()
    if (!tokenIsValid) {
        return res.status(401).send("Invalid token");
    }
}
module.exports = jwtControl