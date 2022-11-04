//jshint esversion:6


require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption")

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


// encrypt key(thats secure in env)

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User =  mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});


app.post("/register",function(req,res){

    const user=new User({
        email: req.body.username,
        password:req.body.password
    })
    user.save(function(err){
        if(!err){
            res.render("secrets")
        }else{
            console.log(err);
        }
    })


})

app.post("/login",function(req,res){


    const username=req.body.username
    const password=req.body.password
    
    User.findOne({email:username },function(err,foundUser){
        if(err){
            console.log(err + "enter correct Email");
        }else{
            if(foundUser.password===password){
                res.render("secrets")
            }else{
                console.log("password not matching");
            }
        }
    })


})




app.listen(3000, function () {
  console.log("server connected");
});
