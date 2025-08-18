// define mongoose
const mongoose  = require('mongoose');

const UserSchema = mongoose.Schema({
    role : {
                    type : String,
                    unique : false,
                    required : true
                },
    name : {
                    type : String,
                    unique : false,
                    required : true
                },
    email : {
                    type : String,
                    unique : true,
                    required : true
                },
    password : {
                    type : String,
                    unique : false,
                    required : true
                },
    
})

module.exports = mongoose.model('User', UserSchema);


