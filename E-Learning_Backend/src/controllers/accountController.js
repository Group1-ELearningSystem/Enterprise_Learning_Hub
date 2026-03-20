import { changePassword, login } from "../services/accountService.js";
import { register } from "../services/accountService.js";
import { verifyCode } from "../services/accountService.js";

export async function loginController(req, res) {
    const {email, password} = req.body
    
    try{
        const user = await login(email,password);
        res.json({success:true, user});
    }catch(err){
        console.log(err)
        if(err.message === "EMAIL_NOT_FOUND"){
            return res.status(400).json({message:"Invalid email"});
        }
        if(err.message === "WRONG_PASSWORD"){
            return res.status(400).json({message:"Invalid password"});
        }
        res.status(500).json({message:"Server error"});
    }
}

export async function registerController(req, res) {
    const {name, email, password} = req.body;

    try{
        const result = await register(name,email,password);
        res.json(result);
    }catch(err){
        console.log(err)
        if(err.message === "EMAIL_EXISTS"){
            return res.status(400).json({
                message:"Email already registered"
            });
        }
        res.status(500).json({
            message:"Server error"
        });
    }
}

export async function verifyController(req, res) {
    const { savedEmail, code } = req.body
    console.log(savedEmail)
    console.log(code)
    try{
        const result = await verifyCode(savedEmail,code);
        res.json(result);
    }catch(err){
        console.log(err)
        if(err.message === "INVALID_CODE"){
            return res.status(400).json({
                message:"Invalid or expired code"
            });
        }

        res.status(500).json({
            message:"Server error"
        });
    }
}

export async function changePasswordController(req, res) {
    const {accountNumber, oldPassword, newPassword} = req.body
    console.log(accountNumber)
    console.log(oldPassword)
    console.log(newPassword)
    try{
        const result = await changePassword(
            accountNumber,
            oldPassword,
            newPassword
        );
        console.log(result)
        res.json(result);
    }catch(err){
        console.log(err)
        if(err.message === "WRONG_PASSWORD"){
            return res.status(400).json({
                message:"Old password is incorrect"
            });
        }
        if(err.message === "PASSWORD_SAME"){
            return res.status(400).json({
                message:"New password must be different"
            });
        }
        res.status(500).json({
            message:"Server error"
        });
    }
}