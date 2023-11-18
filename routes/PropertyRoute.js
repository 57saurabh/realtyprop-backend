const express = require('express');

const propertycontroller = require('../controller/propertycontroller');
const authMiddlewares = require('../middleware/authMiddlewares');
const router=express.Router();

//Create api POST/users

router
    .post('/',authMiddlewares,propertycontroller.createProperty)
    .get('/',propertycontroller.readProperties)
    .get('/:id',propertycontroller.readProperty)
    .put('/:id',authMiddlewares,propertycontroller.updatePropertyPut)
    .patch('/:id',authMiddlewares,propertycontroller.upadatePropertypatch)
    .delete('/:id',authMiddlewares,propertycontroller.deleteProperty)

    
    exports.router=router;