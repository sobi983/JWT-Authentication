//In this file the only authencatiuon endpoints are written no new tokens or refresh tokens are generated
const express = require("express")
const app = express()
require('dotenv').config()
const jwt = require('jsonwebtoken')
app.use(express.json())

const userInfo = [
    {
        name : "Sobi",
        Age: 11
    },
    {
        name : "JB",
        Age: 5
    }
]

//middleware
app.all('/*', (req, res, next)=>{
    res.setHeader('content-type','application/json')
    next()
})

function authenticateUser (req,res, next){
    const authHeader = req.headers['authentication']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.send({message: "Error in Authentication token "})
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data)=>{
        if(err) return res.send(err)
        req.user = data
        console.log(data)
        next()
    })
}

app.get('/userWholeInfo',authenticateUser, (req, res)=>{
    res.send(userInfo.filter(i => i.name === req.user.name))
})

app.listen(3000)