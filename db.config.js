// importations 
const Sequelize = require('sequelize')

// connection a la base de donnee 
let sequelize = new Sequelize(
    process.env.DB_NAME,process.env.DB_USER,process.env.PASSWORD,{
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect:"mysql",
        logging:false
    }
)

// synchronization
sequelize.sync(err =>{
    console.log(`database synchrniztion error : ${err} `)
})

module.exports = sequelize
