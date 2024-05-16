// importations 
const bcrypt = require('bcrypt')
const express = require('express')
const User  = require('../models/user')
const { where } = require('sequelize')
const { raw } = require('mysql2')

//chargement du routeur express

let router = express.Router()

// ajout des routes 

router.get('/all',(req,res,next)=>{console.log("GET request on "+req.originalUrl); next()},(req,res)=>{
    User.findAll()
    .then(users => res.json({data:users}))
    .catch(err=>res.status(500).json({message:"Database Error",error:err}))
})

router.get('/:userEmail',(req,res,next)=>{console.log("GET request on "+req.originalUrl); next()},(req,res)=>{
    User.findOne({where:{email:req.params.userEmail,raw:true}})
    .then(users =>{
        if(users ===null)
            {
                return res.status(404).json({message:"ressource introuvable !"})
            }
        return res.json({data:users})
    })
    .catch(err=>res.status(500).json({message:"erreur dans la base de donnee ",error:err}))

})

router.put('/add',(req,res)=>{
    const {nom,prenom,pseudo,email,password} = req.body
    const emailValidator = /[a-z]@[a-z].[a-z]/
    const nameValidator = /[a-z]/
    if(!nom || !prenom || !pseudo || !email ||!password)
        {
           return res.status(404).json({message:"donnees d'inscriptions manquantes "}) 
        }
    
        User.findOne({where:{email:email},raw:true})
        .then(user =>{
         if(user!==null)
             {
                return res.status(409).json({message:`l'utilisateur ${nom} existe deja !`})
             }   
            })
            .catch(err=>res.status(500).json({message:"erreur dans la base de donnee ",error:err}))
           // hachage du mot de passe 
           bcrypt.hash(password,parseInt(process.env.BCRYPT_SALT_ROUND))
           .then(hashedPassword =>{
               req.body.password = hashedPassword

               //creation de l'utilisateur
               User.create(req.body).then(user=>res.json({message: "utilisateur cree !",data:user}))
           .catch(err=>res.status(500).json({message:"erreur dans la base de donnee ",error:err})) 
           })
           .catch(err=>res.status(500).json({message:"erreur dans le processus de hachage ",error:err})) 
})

router.patch('/:userEmail',(req,res)=>{
   
    User.findOne({where:{email:req.params.userEmail},raw:true})
    .then(users =>{
        if(users ===null)
            {
                return res.status(404).json({message:"utilisateur introuvable !"})
            }
        
            //modification de l'utilisateur
            User.update(req.body,{where:{email:req.params.userEmail}})
            .then(usr =>res.json({message:"donnees a jour !"}))
            .catch(err=>res.status(500).json({message:"erreur dans la base de donnee ",error:err}))
    })
    .catch(err=>res.status(500).json({message:"erreur dans la base de donnee ",error:err}))
})

router.delete('/:userEmail',(req,res) =>{
    let Email = req.params.userEmail

    User.findOne({where:{email:Email},raw:true})
    .then(users =>{
        if(users ===null)
            {
                return res.status(404).json({message:"utilisateur introuvable !"})
            }
        })

        //suppression de l'utilisateur
        User.destroy({where:{email:Email},force: true})
        then(()=>res.status(200).json({message:"utilisateur supprime"}))

})

router.delete('/trash/:userEmail',(res,req)=>{
    let Email = req.params.userEmail

    User.findOne({where:{email:Email},raw:true})
    .then(users =>{
        if(users ===null)
            {
                return res.status(404).json({message:"utilisateur introuvable !"})
            }
        })

        //suppression de l'utilisateur
        User.destroy({where:{email:Email}})
        then(()=>res.status(200).json({message:"utilisateur supprime"}))

})

router.post("/untrash/:email", (req,res)=>{
    let userEmail = req.params.email

    User.restaure({where:{email:userEmail}}
        .then(usr => res.status(204).json({message:"utilisateur restaure"}))
    )
    .catch(err=>res.status(500).json({message:"erreur dans la base de donnee ",error:err}))
})

module.exports = router