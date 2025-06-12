const express= require("express")
const cors=require("cors")
const compression = require("compression")
const app= express()
const session = require("express-session")


app.use(

    cors({
        origin:true,
        credentials:true
    })
)

app.use(compression())

app.use(express.json({limit:"100kb"}))
app.use(express.urlencoded({ limit: "100kb", extended: true }));
app.use(session({
    secret:"just a shit",
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:24 * 60 * 60 * 1000,
        sameSite:'strict'
    }
}))




const userroutes= require("./routes/user.routes.js")
app.use("/api/user",userroutes)


module.exports={app}

