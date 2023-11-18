require('dotenv').config()
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const server = express();
const fileUpload = require('express-fileupload');
const usersRouter =require('./routes/Users')
const authRouter = require('./routes/AuthRoute')
const propertyRouter = require('./routes/PropertyRoute')
const queriesRouter = require('./routes/Queries')
server.use(express.json());
server.use(cors());
server.use(fileUpload({ useTempFiles: true }));



const fs = require('fs');
const authMiddlewares = require('./middleware/authMiddlewares');
const { Server } = require('http');

const data = JSON.parse(fs.readFileSync('data.json','utf-8'));
const users =data.users;
 


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
        console.log('db connected')
  
}



// middleware
server.use(cors());
const Router= express.Router();
server.use(express.json());
server.use(morgan('default'));
server.use(express.static(process.env.PUBLIC_DIR));

server.use('/auth',authRouter.router);
server.use('/user',authMiddlewares,usersRouter.router);
server.use('/queries',queriesRouter.router)
server.use('/property',propertyRouter.router);


// server.get('/users', (req, res) => {
//    res.json(users)
//   })




server.listen(process.env.PORT,()=>{
    console.log('server started');
})
