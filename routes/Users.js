const express = require('express');

const userscontroller = require('../controller/userscontroller')
const router=express.Router();


//Create api POST/users

router
    // .post('/',userscontroller.createUser)
    .get('/',userscontroller.readUsers)
    .get('/:id',userscontroller.readUser)
    .put('/:id',userscontroller.updateUserPut)
    .patch('/:id',userscontroller.upadateUserpatch)
    .delete('/:id',userscontroller.deleteUser)

    
    exports.router=router;