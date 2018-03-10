var mongoose = require('mongoose');
module.exports = mongoose.Schema({
   
    UserName :{type:String},
    EmergencyContact :{type:String},
    Longitude : String,
    Latitude : String, 
    CreatedOn :{ type:Date ,default:Date.now} 

});