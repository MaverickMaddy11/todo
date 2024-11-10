const { verify } = require("crypto");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "maddycool2004";

const users = [];

app.use(express.json());

app.get("/",function(req,res){
    res.sendFile(__dirname + "/login.html")
})

app.post("/signup",function(req,res){
    const username = req.body.username;
    const password = req.body.password; 

    users.push({
        username:username,
        password:password, 
        content:[]
    })

    res.status(200).json({
        message: "you have successfully signed up "
    })
})


app.post("/signin",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    let finduser = null; 
    for(let i = 0 ; i < users.length; i ++ ){
        if(users[i].username == username && users[i].password == password){
            finduser = users[i];
        }
    }

    if(finduser != null ){
        const token = jwt.sign({
            username:finduser.username
        },JWT_SECRET);

        res.status(200).json({
            token:token
        })
    }

    else{
        res.status(400).json({
            message: "wrong id or password "
        })
    }
})

function auth(req, res, next) {
    const authHeader = req.headers.authorization;  // Correct way to access the token
    const token = authHeader && authHeader.split(' ')[1];  // Extract the token from "Bearer <token>"

    console.log("Authorization header: ", authHeader); // Log for debugging
    console.log("Extracted token: ", token);  // Log for debugging

    if (!token) {
        return res.status(400).json({
            message: "You are not authorized, no token provided."
        });
    }

    try {
        console.log("Inside auth try block");
        const decdata = jwt.verify(token, JWT_SECRET);
        req.username = decdata.username;
        console.log("Token verified, username set:", req.username);
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        console.log("Error verifying token", err);
        return res.status(401).json({
            message: "You are not authorized, invalid token."
        });
    }
}




app.get("/todo",auth,function(req,res){
    
    res.sendFile(__dirname + "/content.html")
})


app.listen(3000);