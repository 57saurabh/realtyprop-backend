const mongoose = require('mongoose');
const { Schema } = mongoose;



//schema
const userSchema = new Schema({
    name: {type:String, required: true},
    email: { type: String, 
        unique: true,
        required: true,
        validate: {
            validator: function(v) {
              return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
          },
         },
    password:{type: String, minLength:6, required:true},
    phoneNo:{type:String,required:true},
    role:{type:String, default: 'user'},
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    verificationTokenExpiry: Date,
    token:String,
});

 exports.User = mongoose.model('Users', userSchema);
