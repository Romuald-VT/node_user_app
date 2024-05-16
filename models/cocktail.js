// importations 

const Datatype = require('sequelize')
const database = require('../db.config')

const Cocktail = database.define('Cocktail',{
    id:{
        type:Datatype.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:Datatype.INTEGER(11),
        allowNull:false
    },
    nom:{
        type:Datatype.STRING(100),
        defaultValue:'',
        allowNull:false
    },
    description:{
        type:Datatype.TEXT,
        defaultValue:"",
        allowNull:false,
    },
    recette:{
        type:Datatype.TEXT,
        defaultValue:"",
        allowNull:false
    }
},{paranoid: true})

Cocktail.sync()
module.exports= Cocktail