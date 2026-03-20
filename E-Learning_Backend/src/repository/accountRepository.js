import db from "../config/db.js";

export async function getNextAccountNumber(){
    const query = `
        SELECT Account_Number
        FROM Accounts
        WHERE Account_Number REGEXP '^ACC[0-9]+$'
        ORDER BY LENGTH(Account_Number) DESC, Account_Number DESC
        LIMIT 1
    `;
    const [rows] = await db.execute(query);
    if(rows.length === 0){
        return "ACC001";
    }
    const lastId = rows[0].Account_Number;
    const num = parseInt(lastId.replace("ACC","")) + 1;
    return "ACC" + num.toString().padStart(3,"0");
}

export async function findAccountByNumber(accountNumber){
    const query = 
    `
        SELECT *
        FROM Accounts
        WHERE Account_Number = ?
    `
    const [rows] = await db.execute(query, [accountNumber])
    return rows[0];
}

export async function findAccountByEmail(email){
    const query = `
        SELECT a.Account_Number, a.Account_Password, a.Account_Roles, a.Account_Status, a.Account_Username, phone, email, Instructor_ID
        FROM (
            SELECT i.Instructor_ID, i.Account_Number, i.Instructor_Email_Address AS email, i.Instructor_Phone_Number AS phone
            FROM Instructor i
            
            UNION
            
            SELECT l.Learner_ID, l.Account_Number, l.Learner_Email_Address, NULL
            FROM Learner l
            
            UNION
            
            SELECT e.Employee_ID, e.Account_Number, e.Employee_Email_Address, e.Employee_Phone_Number
            FROM Employee e
        ) userEmails
        JOIN Accounts a ON a.Account_Number = userEmails.Account_Number
        WHERE email = ?
    `;

    const[rows] = await db.execute(query, [email])
    return rows[0]
}

export async function findAccountByStudentEmail(email){
    const query = `
        SELECT a.*
        FROM Accounts a
        JOIN Learner l ON a.Account_Number = l.Account_Number
        WHERE l.Learner_Email_Address = ?;
    `
    const [rows] = await db.execute(query,[email]);
    return rows[0];
}

export async function createAccount(account){
    const query = `
        INSERT INTO Accounts
        (Account_Number, Account_Username, Account_Password, Account_Roles, Account_Status)
        VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(query,[
        account.accountNumber,
        account.username,
        account.password,
        account.role,
        account.status
    ]);
}

export async function updateAccount(learnerEmail) {
    const query=
    `
        UPDATE Accounts a
        JOIN Learner l ON a.Account_Number = l.Account_Number
        SET a.Account_Status = 'Active'
        WHERE l.Learner_Email_Address = ?
    `
    await db.execute(query, [learnerEmail])
}

export async function UpdatePassword(accountNumber, hashedPassword) {
    const query=
    `
        UPDATE Accounts
        SET Account_Password = ?
        WHERE Account_Number = ?

    `
    await db.execute(query, [hashedPassword, accountNumber])
}
