var connection = require('./connection');
var express = require('express');
var port = 4001;
var mongoose = require('mongoose');
var app = express();
var bodyParser = require ('body-parser');
var path = require('path');
var cors = require('cors');
mongoose.Promise = global.Promise;
var moment = require('moment');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

/* model list */
var registermodel = require('./model/registerModel');
var emergencymodel = require('./model/emergencyModel');
var algoModel = require('./model/algoModel');

console.log(connection.connectionString);

app.use(bodyParser.json());
mongoose.connect(connection.connectionString,{
    keepAlive:true,
    reconnectTries:Number.MAX_VALUE
    //useMongoClient:true
});

var register = mongoose.model('registerinfo', registermodel, 'UserDetails');
var emergency = mongoose.model('emergencyinfo', emergencymodel, 'EmergencyHistory');

app.post('/api', function(req, res){
    res.send({
        success:true,
        message:"Welcome to API"});
});

//verify token
function verifyToken (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,"supersecret", function (err, decoded) {
            if(err){
                res.status(403).json({
                    success:true,
                    message:"Wrong Token"
                });
            }
            else{
                req.decoded = decoded;
                next();
            }
        });
    }
    else{
        res.status(403).json({
            success:false,
            message:"No Token"
      });
    }
};

//
app.get('/getvalue', function(req, res){
    emergency.find({}).exec(function(err, docs){
    res.json({"Status":"Success",docs});      
    });
});

//getPanicDetails
app.get('/api/getPanic', verifyToken, function (req, res) {
    let user = req.decoded.username;
    try {
        if (user){
            emergency.findOne({
                EmergencyContact:user}).sort({CreatedOn:-1}).exec(function (err, docs) {
                    if(docs){
                        let userA = docs.UserName
                        let longA = docs.Longitude
                        let latA  = docs.Latitude
                            register.findOne({
                                UserName:userA}).exec(function (err, docsUser) {
                                    let longB = docsUser.Longitude
                                    let latB  = docsUser.Latitude
                                        if ((longA == longB) && (latA == latB)){
                                            res.send({
                                                success:true,
                                                message : userA + " currently in a danger situation. The location is at Longitude : " + longA + " and Latitude : " + latA  
                                            })
                                        }else if (!(longA == longB) && (latA == latB)){
                                            res.send({
                                                success:false,
                                                message:"Location doesn't match"
                                            })
                                        }
                            });
                    }else if (!docs){
                        res.send({
                            success:false,
                            message:"No data found"});
                    }
            });
        }else if (!user){
            res.send({
                success:false,
                message:"You need to login!"});
        }

        
    }catch (err){
        res.send({
            success:false,
            error:err});
    }
});

//postPanicDetails
app.post('/api/postPanic', verifyToken, function (req, res) {
    let panic = req.body.panic;
    let user = req.decoded.username;
    try {
        if (panic == 1){
            register.findOne({
                UserName:user}).exec(function (err, docsUser) {
                    try{
                        if (docsUser){ 
                            let emergencyCon = docsUser.EmergencyContact;
                            let lon = docsUser.Longitude;
                            let lat = docsUser.Latitude;
                            var emergencyData = new emergency ({ 
                                UserName : user,
                                EmergencyContact : emergencyCon,
                                Longitude : lon,
                                Latitude : lat});
                                if (emergencyCon){
                                    emergencyData.save(function (err, docs) {
                                        res.send({
                                            success:true,
                                            contact:emergencyCon,
                                            longitude:lon,
                                            latitude :lat});
                                    });
                                }
                                else if (!emergencyCon){
                                    res.send({
                                        success:false,
                                        message:"User not assign to any emergency contact"});
                                }
                        }
                    }catch (err){
                        res.send({
                            success:false,
                            error:err});
                    }
                });
        }
        if ((panic == 0) || (!panic) || (panic == "")){
            res.send({
                success:false,
                message:"Panic value not available"});
        }
    }catch (err){
        res.send({
            success:false,
            error:err});
    }
});

//login
app.post('/api/login', function (req, res) {
    let getemail = req.body.email;
    let getpass = req.body.password;
    let email = getemail.trim();
    let pass = getpass.trim();
    let md5pass = (md5(pass));  

    try {
        if(pass && email == "") throw "Email is empty";
        if(email && pass == "") throw "Password is empty";  
        register.findOne({
                UserEmailID:email}).exec(function (err, docs) {
            try {
                if (err) throw err;
                if (docs){
                    let username = docs.UserName;
                    var keyPass = docs.Password;
                    if(keyPass == md5pass){
                        var token = jwt.sign({username}, "supersecret", { expiresIn: '24h' });
                            res.send({
                                success:true,
                                token:token});
                    }
                    else if(keyPass != md5pass){
                        res.send({
                            success:false,
                            message:"Incorrect password"});
                    }    
                }
                else if(!docs){
                    res.send({
                        success:false,
                        message:"User not found"});
                } 
            } catch (err) {
                res.send({
                    success:false,
                    error:err});
            }    
        });
    } catch (err) {
        res.send({
            success:false,
            error:err});
    }
});

//register
app.post('/api/register', function (req,res) {
    try {
        var userid = req.body.userid;
        var email = req.body.email;
        var fname = req.body.fname;
        var lname = req.body.lname;
        var password = req.body.password;
        var mobphone = req.body.mobilephone;
        var address = req.body.address;
        var registerDetails = new register
            (
                {
                    UserName: userid,
                    UserEmailID :email,
                    FirstName: fname,
                    LastName: lname,
                    Password: (md5(password)),
                    MobilePhone : mobphone,
                    Address :address
                }
            );

            registerDetails.save(function (err, docs) {
                try {
                    if (err) {
                        throw err.message;
                    }
                    else if (docs) {
                        res.send({
                            success:true,
                            message:"User successfully registered"
                        });
                    }
                }
                catch(err){
                    res.send({
                        sucess:false,
                        error:err
                    });
                }
            });
    }
    catch(err){
        res.send({
            sucess:false,
            error:err
        });
    }
});

//connecting to port
app.listen(port, function(){
    console.log('app listen on port ' + port);
});