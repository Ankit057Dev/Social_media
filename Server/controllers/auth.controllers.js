import User from "../models/user.model"

export const signUp=async(req,res)=>{
    try {
        const{name,email,password,userName}=req.body
        const findByEmail = await User.findOne({email})
        if(findByEmail){
        return res.status(400).json({message:"Email already exist!"})
        }

        const findByUsername = await User.findOne({userName})
        if(findByUsername){
        return res.status(400).json({message:"Username already exist!"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,
            userName,
            email,
            password:hashedPassword
        })

        const token = await genToken(user_id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:1*365*24*60*60*1000,
            secure:false,
            sameSite:"Strict"
        })

        return res.status(201).json(user)


    } catch (error) {
        return res.status(500).json({message:`signup error ${error} `})
    }
}