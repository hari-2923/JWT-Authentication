const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const dotenv = require("dotenv").config()
const jwt = require("jsonwebtoken")

app.listen(process.env.PORT || 5000)
app.use(bodyParser.json())

app.post("/users", (req,res) =>{
    const username = req.body.username
    const user = { name: username }
    const acceessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    res.json({ acceessToken: acceessToken, refreshToken: refreshToken })
    
})

// Middleware for token Authentication
function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3s" })
}