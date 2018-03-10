var mongoose = require('mongoose');
module.exports = mongoose.Schema({ 

    AlgorithmId :{type:Number,required: true,unique:true},
    Parameters:[],
    Status : {type:String,default:'Active'}, 
    CreatedBy:{ type:String,default:'SYSTEM'},
    CreatedOn:{ type:Date ,default:Date.now},
    ModifiedBy:{ type:String,default:'SYSTEM'},
    ModifiedOn:{type:Date ,default:Date.now}
    
});
