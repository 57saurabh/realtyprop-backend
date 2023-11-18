const mongoose = require('mongoose');
const { Schema } = mongoose;



//schema
const quriesSchema = new Schema({
    name: {type:String, required: true},
    qemail: { type: String, 
        // unique: true,
        required: true,
        validate: {
            validator: function(v) {
              return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
          },
         },
         userType:{
            type:String,
            required:true
         },
    phoneNo:{type:String,required:true},
    message:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    resolved:{
        type:Boolean
    }
});

 exports.Queries = mongoose.model('Queries', quriesSchema);
