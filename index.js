// importations

const express = require('express')
const cors = require('cors')

const Database = require('./db.config')

//creation du serveur
const app = express()
const port = process.env.PORT

//importation des routeurs
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')


//configuration du serveur
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/customer',userRouter)
app.use('/auth',authRouter)
// creation des routes 

app.get("/", (req,res)=>{
    res.send("Hi Mum !")
})
app.get('*',(req,res)=>{
    res.status(404).send("ressources introuvables !")
})

Database.authenticate()
     .then(()=>{console.log("database connection ok !")})
     .then(()=>{app.listen(port,()=>{
        console.log("the server is running on port "+port+"... ")
    })})
    .catch(err=>{console.log("database error",err)})

