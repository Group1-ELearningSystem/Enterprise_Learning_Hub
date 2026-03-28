import bcrypt from "bcryptjs";
import { findAccountByEmail, findAccountByStudentEmail, createAccount, getNextAccountNumber, updateAccount, findAccountByNumber, UpdatePassword} from "../repository/accountRepository.js";
import { createLearner, getNextLearnerId } from "../repository/learnerRepository.js";
import { sendEmail } from "../utils/emailUtils.js";
import { saveVerificationCode, generateVerificationCode, validateVerificationCode } from "../utils/verificationCodeUtils.js";

export async function verifyCode(emailAddress, code) {
    const valid = validateVerificationCode(emailAddress,code);
    if(!valid){
        throw new Error("INVALID_CODE");
    }

    await updateAccount(emailAddress)

    return {
        message:"Email verified successfully"
    };
}

export async function login(email, password){
    const account = await findAccountByEmail(email)

    if(!account){
        throw new Error("EMAIL_NOT_FOUND");
    }

    const match = await bcrypt.compare(password, account.Account_Password);

    if(!match){
        throw new Error("WRONG_PASSWORD");
    }
    return account;
}

export async function register(fullName, emailAddress, password) {
    const existing = await findAccountByStudentEmail(emailAddress)
    if(existing){
        throw new Error("EMAIL_EXIST")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const accountNumber = await getNextAccountNumber()
    const learnerId = await getNextLearnerId()
    const username = fullName.replace(/\s/g,'')

    await createAccount({
        accountNumber,
        username,
        password: hashPassword,
        role: "Learner",
        status: "Not Verified"
    })

    await createLearner({
        learnerId,
        fullName,
        emailAddress,
        accountNumber
    });

    const verificationCode = generateVerificationCode();
    saveVerificationCode(emailAddress, verificationCode)
    await sendEmail(emailAddress, "Your Verification Code", `Your six-digit code for registration ${verificationCode}`)

    return {
        message:"Verification code sent",
        emailAddress
    };
}

export async function changePassword(accountNumber, oldPassword, newPassword){
    console.log(accountNumber)
    const account = await findAccountByNumber(accountNumber)
    if(!account){
        throw new Error("ACCOUNT_NOT_FOUND");    
    }

    console.log(account.Account_Password)
    console.log(oldPassword)
    const match = await bcrypt.compare(oldPassword, account.Account_Password)
    if(!match){
        throw new Error("WRONG_PASSWORD")
    }

    if(oldPassword === newPassword){
        throw new Error("PASSWORD_SAME")
    }

    const hashedPassword = await bcrypt.hash(newPassword,10);
    console.log(hashedPassword)
    await UpdatePassword(accountNumber, hashedPassword);

    return {
        message:"Password updated successfully"
    }
}