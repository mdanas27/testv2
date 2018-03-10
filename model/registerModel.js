var mongoose = require('mongoose');
module.exports = mongoose.Schema({
   
    UserName :{type:String,unique:true},
    UserEmailID :{type:String,unique:true},
    FirstName :String,
    LastName : String,
    Password :String,
    MobilePhone :{ type:Number},
    Address : String,
    EmergencyContact : String,
    Longitude : String,
    Latitude : String,
    CreatedOn :{ type:Date ,default:Date.now}    
});