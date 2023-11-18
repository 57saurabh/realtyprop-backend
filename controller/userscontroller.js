const fs   =require('fs')

// const index = fs.readFileSync('index.html','utf-8');
const data = JSON.parse(fs.readFileSync('data.json','utf-8'));
const users =data.users;
const model = require('../model/user')

const User = model.User;

//create
// exports.createUser = async (req,res)=>{
//     try {
//             const user= new User(req.body);

//             // user.name= "Terry Medhurst";
//             // user.email= "atuny0@shu.com";
//             // user.phoneNo=7916758914;
            
//             const savedUser = await user.save();
//             console.log(savedUser);
//             res.status(201).json(req.body);

//     } catch (error) {
//         console.error(error);
//         res.status(400).json({message:'server error'});
//     }
// }

// exports.createUser=(req,res)=>{
//     console.log(req.body);
//     users.push(req.body);
//     res.json(req.body)
//     res.json({type:'POST'})
// }

exports.readUsers=async (req,res)=>{
    try {
        const user = await User.find();
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: 'Error reading users',error });
    }
}

exports.readUser= async (req,res)=>{
    try{
    const id = req.params.id;
    const user = await User.findById(id);
    res.json(user)
} catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error reading user' });
  }

}


exports.updateUserPut=async (req,res)=>{
    const id = req.params.id;
    try {
      const doc = await User.findOneAndReplace({ _id: id }, req.body, {new:true});
      res.status(201).json(doc);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error replacing user', error });
    }
  };
  
exports.upadateUserpatch=async (req,res)=>{
    const id = req.params.id;
    try {
      const doc = await User.findOneAndUpdate({ _id: id }, req.body,{new:true});
      res.status(201).json(doc);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error updating user', error });
    }
  };
  

exports.deleteUser = async(req,res)=>{
    
    const id = req.params.id;
    try {
      const doc = await User.findOneAndDelete({ _id: id });
      res.status(201).json(doc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error Deleting product', error });
    }
}