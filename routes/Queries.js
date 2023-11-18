const express = require('express');

const queriescontroller = require('../controller/queriescontroller');
const authMiddlewares = require('../middleware/authMiddlewares');
const router=express.Router();


//Create api POST/users

router
    .post('/',queriescontroller.createQuery)
    .get('/',authMiddlewares,queriescontroller.getAllQueries)
    .get('/:id',authMiddlewares,queriescontroller.getQueryById)
    .put('/:id',authMiddlewares,queriescontroller.updateQueryByIdPut)
    .patch('/:id',authMiddlewares,queriescontroller.updateQueryById)
    .delete('/:id',authMiddlewares,queriescontroller.deleteQueryById)

    
    exports.router=router;