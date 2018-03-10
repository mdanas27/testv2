var mongoose = require('mongoose');
module.exports = mongoose.Schema({    

    ProjectID :{type:String,required: true,unique:true},
    ProjectName :{type:String,required: true,unique: true},
    Description : {type:String},
    ModalTypeID :{type:Number},
    AlgorithmID :{type:Number},
    Status:{type:String,default:"Active"},
    CreatedBy:{type:String},
    CreatedOn:{type:Date ,default:Date.now},
    ModifiedBy:{type:String},
    ModifiedOn:{type:Date ,default:Date.nkow}

});

