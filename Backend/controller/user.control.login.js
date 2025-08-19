import bcrypt from 'bcryptjs';
import CryptoJS from "crypto-js";
import User from '../models/user.model.js';

export const login = async (req , res)=>{
    try {
        const  {email , password } = req.body  ;

        const user =await User.findOne({email})
        if (!user) {
            return res.status(404).json({message:"in-valid login Data"})
        }
        const match =await bcrypt.compare(password,user.password) ;
        if (!match) {
            return res.status(404).json({message:"in-valid login Data"})
        }
        if (!user.confirmEmail) {
            return res.status(403).json({ message: "Please confirm your email before proceeding" });
        }
        user.phone = CryptoJS.AES.decrypt(user.phoneNumber , process.env.ENCRYPT).toString(CryptoJS.enc.Utf8)

        return res.status(200).json({message : "done" })

    } catch (error) {
        
         console.error("Signup error:", error);
        return res.status(500).json( {  message: 'Internal server error'});
    }
}
