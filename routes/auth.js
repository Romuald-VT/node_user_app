const express = require("express")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const User = require('../models/user')
const { raw } = require("mysql2")

let router = express.Router()
router.use((req,res,next)=>{
    console.log("POST request on /login ")
    next()
})

router.post('/login',(req,res)=>{

    const {email,password} = req.body

    //verification des donnee
    if(!email||!password)
        {
            return res.status(400).json({message:"donnees entrees invalides !"})
        }
    User.findOne({where:{email:email},raw:true})
    .then(usr =>{
        if(usr ===null)
            {
                return res.status(401).json({message:"ce compte n'existe pas !"})
            }
        //verification du mot de passe 
        bcrypt.compare(password,usr.password)
        .then(test=>{
            if(!test)
                {
                    return res.status(401).json({message:"mauvais mot de passe !"})
                }
            //generation du token 
            const token = jwt.sign(
                {
                    id:usr.id,
                    nom:usr.nom,
                    prenom:usr.prenom,
                    email:usr.email
                },process.env.JWT_SECRET,{expiresIn:process.env.JWT_DURATION})

                return res.json({acces_token:token})
        })
        .catch(err=>res.status(500).json({message:"echec de connexion !", error: err}))
    })
    .catch(err=>res.status(500).json({message:"erreur dans la base de donnee ",error:err}))
})

module.exports = router