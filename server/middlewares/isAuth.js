import jwt from "jsonwebtoken"


const isAuth = async (req,res,next) => {
    try {
        let token = null

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token
        } else if (req.headers && req.headers.authorization) {
            const parts = req.headers.authorization.split(" ")
            if (parts.length === 2 && parts[0] === "Bearer") {
                token = parts[1]
            }
        } else if (req.body && req.body.token) {
            token = req.body.token
        }

        if(!token){
            return res.status(400).json({message:"user does not have a token"})
        }

        const verifyToken = jwt.verify(token , process.env.JWT_SECRET)

        if(!verifyToken){
            return res.status(400).json({message:"user does not have a valid token"})
        }
        req.userId = verifyToken.userId

        next()
   

    } catch (error) {
        return res.status(500).json({message:`isAuth error ${error}`})
    }
    
}

export default isAuth