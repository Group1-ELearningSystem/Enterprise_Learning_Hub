const verificationStore = new Map();

export function generateVerificationCode(){
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}

export function saveVerificationCode(email, code){
    const expire = Date.now() + 10 * 60 * 1000;
    verificationStore.set(email,{
        code,
        expire
    });
    console.log(verificationStore)
}

export function validateVerificationCode(email, inputCode){
    const record = verificationStore.get(email);
    if(!record) return false;

    if(Date.now() > record.expire){
        verificationStore.delete(email);
        return false;
    }

    if(record.code !== inputCode){
        return false;
    }

    verificationStore.delete(email);
    return true;
}