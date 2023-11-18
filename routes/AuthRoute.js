require('dotenv').config()
const express = require('express');
const model = require('../model/user')
// const studentModel = require('../Model/student')
// const Student = studentModel.Student;
const User = model.User;
const jwt= require('jsonwebtoken')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const authMiddlewares = require('../middleware/authMiddlewares');



// const userscontroller = require('../Controller/usercontroller')
// const authcontroller = require('../Controller/authcontroller')

const router=express.Router();

router.post('/register',async (req,res)=>{
    try {
            const existingUser =  await User.findOne({ email:req.body.email });
            if(existingUser){
                return res.send({
                    message: 'User already exist.'
                })
            }
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const user= new User(req.body);
            var token = jwt.sign({ email: req.body.email }, process.env.SECRET );
            const hash = bcrypt.hashSync(req.body.password, 10);
            user.token = token;
            user.password = hash;
            user.isEmailVerified= false;
            user.role='user';
            user.emailVerificationToken= verificationToken;
            user.verificationTokenExpiry= Date.now() + 24 * 60 * 60 * 1000 // Token expiry (e.g., 24 hours)
      
            console.log(hash)
            // user.name= "Terry Medhurst";
            // user.email= "atuny0@shu.com";
            // user.phoneNo=7916758914; 
            console.log(user)
            const savedUser = await user.save();
            console.log(savedUser);
            await sendVerificationEmail(req.body.email, verificationToken);
            
            res.status(200).json({email:req.body.email,
                token,
                message:'Signup successful!'
            });
            
    } catch (error) {
        console.error(error);
        res.status(400).json({ message:'server error',error:error});
    }
})


//login
router.post('/login', async (req,res)=> {
    try {
        const doc = await User.findOne({email:req.body.email});
        if (!doc) {
            // If no user is found with the provided email, return a 401 Unauthorized status.
            return  res.status(401)
            .json({ message:'invalid Credentials'});
        }
        const isAuth = bcrypt.compareSync(req.body.password, doc.password);
        if (!isAuth) {
            return res.send({
                message:'Incorrect Password'
            })
        }
        if(doc.isEmailVerified == false){
            return res.send({
                message:'Email not verified'
            })
        }
            var token = jwt.sign(
                { email: req.body.email },
                 process.env.SECRET,
                 {expiresIn:'1d'} 
                 );
            doc.token= token
            const saveddoc = await doc.save();
            if (token) {
                res.json({token,
                        email:req.body.email,
                        massage:'logined successfully!',
                        })
            } 
                

    } catch (error) {
        console.error(error);
        res.status(400).json({message:'server error',error});
    }
})



router.post('/get-user-by-id',authMiddlewares, async (req,res)=>{
  
    try {
        const user = await User.findOne({email:req.body.email});
        res.send({
                
                message:'User fetched successfully!',
                data: user,
                success: true,
            })    
        
    } catch (error) {
        res.status(400).json({message:'server error',error});

    }

})


// Email verification endpoint
router.post('/verify-email', async (req, res) => {
    try {
      const { token } = req.body;
      const user = await User.findOne({ emailVerificationToken: token });
        console.log(token)
        console.log(user)
      if (!user) {
        return res.status(404).json({ message: 'Invalid or expired token.' });
      }
  
      // Check if token has expired
      if (user.verificationTokenExpiry < Date.now()) {
        return res.status(400).json({ message: 'Token has expired.' });
      }
  
      // Update user's email verification status
      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      user.verificationTokenExpiry = null;
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error in email verification.' });
    }
  });
  
  // Function to send verification email
  const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
      });
  
    const mailOptions = {
      from: 'noreply@realtyprop.in',
      to: email,
      subject: 'Email Verification',
      html:`<div style="text-align: center; padding: 40px 0; font-family: Arial, sans-serif;">
      <h2 style="color: #444;">Email Verification</h2>
      <p style="font-size: 16px; color: #666; max-width: 400px; margin: 0 auto 20px;">
        Thank you for registering! Please verify your email address to activate your account.
      </p>
      <a href="http://localhost:3000/verify/${token}" style="background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px;">
        Verify Email
      </a>
    </div>`
    };
  
    await transporter.sendMail(mailOptions);
  };

 exports.router=router;
