//In this file New and Refresh Tokens are generated
const express = require("express")
const app = express()
require('dotenv').config()
const jwt = require('jsonwebtoken')
app.use(express.json())

let RefreshTokens = []


app.post("/login", (req, res)=>{
    const username = req.body.username
    const user= { name : username}

    //Create simple access token without expiry time, i have used callback to create it!
    // jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,(err, data)=>{
    //     if(err) {return err}
    //     console.log(data)
    // })
    
    //This will simply create a token for 15 seconds from where The admin can request for the user data and see it
    const token = generateAccessToken(user)
    //After expiration of the token the user will refresh the page to create the another token to access the data
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    RefreshTokens.push(refreshToken)
    res.json({AccessToken: token, RefreshToken: refreshToken})
})

app.post('/generateAnotherToken', (req, res)=>{
    const token = req.body.token
    if(token == null) return res.status(404).send({message: "Invalid Token"})
    if(!RefreshTokens.includes(token)) return res.status(401).send({message: "Token Not Available"})
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, data)=>{
        if(err) return res.status(400).send({message: "Error while gnerating the Token"})
        const refreshedAccessToken = jwt.sign({name : data.name }, process.env.ACCESS_TOKEN_SECRET)
        res.send({Token: refreshedAccessToken })
       
    })

})

const generateAccessToken = (data)=>{
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}
app.listen(4000)