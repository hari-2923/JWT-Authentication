const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const dotenv = require("dotenv").config()
const jwt = require("jsonwebtoken")

app.listen(process.env.PORT || 5000)
app.use(bodyParser.json())

let refreshTokens = [ ]

app.post("/token", (req,res) => {
    const refreshToken = req.body.token
    console.log("Received refresh token")
    if (!refreshToken) {
        console.log("No refresh token provided")
        return res.sendStatus(401)
    }
    if(!refreshTokens.includes(refreshToken)){
        console.log("Invalid Token")
        return res.sendStatus(403)
    }
    else{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            else{
                const accessToken = generateAccessToken({ name: user.name })
                console.log("Generated Token");
                res.json({ accessToken: accessToken })
            }
        })
    }
})

app.delete("/logout", (req,res) => {
    refreshTokens = refreshTokens.filter((token) => {
        return token !== req.body.token
    })
    res.json("User token Deleted")
})

app.post("/login", (req,res) =>{
    const username = req.body.username
    const user = { name: username }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
    
})

// Middleware for token Authentication
function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" })
}