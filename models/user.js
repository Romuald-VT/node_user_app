// importations 

const Datatype = require('sequelize')
const database = require('../db.config')
const nodemon = require('nodemon')

const User = database.define('User',{
    id:{
        type:Datatype.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    nom:{
        type:Datatype.STRING(100),
        defaultValue:'',
        allowNull:false
    },
    prenom:{
        type:Datatype.STRING(100),
        defaultValue:'',
        allowNull:false
    },
    pseudo:{
        type:Datatype.STRING(100),
        allowNull:false,
        unique:true
    },
    email:{
        type:Datatype.STRING,
        validate:{
            isEmail:true,
        }
    },
    password:{
        type:Datatype.STRING(64),
        is:/^[0-9a-f](64)$/i
    }
},{paranoid: true})

module.exports= User