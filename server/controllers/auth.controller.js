import genToken from "../config/token.js"
import User from "../models/user.model.js"


export const googleAuth = async (req,res) => {
    try {
        const {name , email} = req.body
        console.log('Received /api/auth/google body:', req.body)
        let user = await User.findOne({email})
        console.log('Found user:', user)
        if(!user){
            user = await User.create({
                name , 
                email
            })
            console.log('Created new user:', user)
        }
        let token = await genToken(user._id)
        res.cookie("token" , token , {
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ user, token })



    } catch (error) {
        return res.status(500).json({message:`Google auth error ${error}`})
    }
    
}

export const logOut = async (req,res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
         return res.status(500).json({message:`Logout error ${error}`})
    }
    
}