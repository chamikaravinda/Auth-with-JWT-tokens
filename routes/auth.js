const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const {registerValidation,loginValidation}=require('../validation');

dotenv.config();


//Register
router.post('/register',async (req,res) =>{

    //Validate the data
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if the user is already in the database
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');
    

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword =  await bcrypt.hash(req.body.password,salt);


    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashPassword
    });

    try{
        const savedUser = await user.save();
        res.send({user:savedUser._id});
    }catch(err){
        res.status(400).send(err);
    }

});

//Login
router.post('/login',async (req,res) =>{
    //Validate the data
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if the email exist
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Email is not found');

    //check the password is correct
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invalid password')

    //Create and assign a token 
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
 });

module.exports=router;