const userModel = require('../model/userModel');

const loginPage = (req,res) => {
    res.render('./pages/login');
};

const registerPage = (req,res) => {
    res.render('./pages/register');



};


const login = (req,res) => {



};


const register = async(req,res) => {
    try {
        const user = new userModel(req.body)
        const save = await user.save()
        console.log(save)
        if(user.createdAt){
            console.log("var")
            res.redirect('/login')
        }else{
            res.render('./pages/register')
        }
    
    
    } catch (error) {
        res.status(500).render('./pages/register',{message : error})
    }


};

module.exports = {
    loginPage,
    registerPage,
    login,
    register
}