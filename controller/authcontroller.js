// const users =data.users;
const model = require('../model/user')
const User = model.User;
const jwt= require('jsonwebtoken')
const bcrypt = require('bcrypt')

//create
exports.createUser = async (req,res)=>{
    try {
            const existingUser =  await User.findOne({ email:req.body.email });
            if(existingUser){
                return res.send({
                    message: 'User already exist.'
                })
            }
            const user= new User(req.body);
            var token = jwt.sign({ email: req.body.email }, process.env.SECRET );
            const hash = bcrypt.hashSync(req.body.password, 10);
            user.token = token;
            user.password = hash;
            console.log(hash)
            // user.name= "Terry Medhurst";
            // user.email= "atuny0@shu.com";
            // user.phoneNo=7916758914; 
            const savedUser = await user.save();
            console.log(savedUser);
            
            res.status(201).json({token,
                                message:'Signup successful!',
                                success:true,
                                });

    } catch (error) {
        console.error(error);
        res.status(400).json({message:'server error',error});
    }
}




exports.signin = async (req,res)=>{
    try {
        const doc = await User.findOne({email:req.body.email});
        if (!doc) {
            // If no user is found with the provided email, return a 401 Unauthorized status.
            return  res.status(401)
            .json({message:'invalid Credentials'});
        }
        const isAuth = bcrypt.compareSync(req.body.password, doc.password);
        if (!isAuth) {
            return res.send({
                message:'Incorrect Password'
            })
        }
            var token = jwt.sign(
                { email: req.body.email },
                 process.env.SECRET,
                 {expiresIn:'1d'} 
                 );
            doc.token= token
            const saveddoc = await doc.save();
            res.json({token})

        // else{
        //     res.sendStatus(401);
        //     console.log(res.sendStatus(401))
        // }

    } catch (error) {
        console.error(error);
        res.status(400).json({message:'server error',error});
    }
}
