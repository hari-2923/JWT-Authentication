const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const dotenv = require("dotenv").config()
const jwt = require("jsonwebtoken")

app.listen(3000)
app.use(bodyParser.json())

const users = [
    {
        username: "Hari",
        email: "harigovind@gmail.com"
    },
    {
        username: "Ageesh",
        email: "ageesh@ghasham.com"
    },
    {
        username: "Anirudh",
        email: "Anirudh@gmail.com"
    }
]

app.get("/users", authenticateToken, (req,res) => {
    const filteredUsers = users.filter(user => user.username === req.user.name);

    if (filteredUsers.length === 0) {
        console.log("User not found");
        return res.sendStatus(404);
    }

    res.json(filteredUsers);
})


// Middleware for token Authentication
function authenticateToken(req,res,next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if(token == null){
        console.log("Token not found")
        res.sendStatus(401)
    }
    else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
            if(err){
                console.log("Token verification failed")
                return res.sendStatus(403)
            }
            else{
                console.log("Token verified successfully")
                req.user = user
                next()
            }
        })
    }
}