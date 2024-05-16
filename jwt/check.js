const jwt = require('jsonwebtoken')

//extraction du token
const extractToken = (authorization)=>{

    if(typeof authorization !== 'string')
        {
            return false
        }
    const matches = authorization.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

// verifiction de la presence du token 

const checkTokenBearer = (req,res,next)=>
{
    let token = req.headers.authorization && extractToken(req.headers.authorization)

    if(!token)
        {
            return res.status(401).json({message:"requete invalide "})
        }
    jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken) =>{
        if(err)
            {
                return res.status(401).json({message:"jetton de securite invalide ! "})
            }
        next()
    })
}

module.exports= checkTokenBearer