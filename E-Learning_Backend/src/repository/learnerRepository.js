import db from "../config/db.js"

export async function getNextLearnerId(){
    const query = `
        SELECT Learner_ID
        FROM Learner
        WHERE Learner_ID REGEXP '^LEA[0-9]+$'
        ORDER BY LENGTH(Learner_ID) DESC, Learner_ID DESC
        LIMIT 1
    `;
    const [rows] = await db.execute(query);
    if(rows.length === 0){
        return "LEA001";
    }
    const lastId = rows[0].Learner_ID;
    const num = parseInt(lastId.replace("LEA","")) + 1;
    return "LEA" + num.toString().padStart(3,"0");
}

export async function createLearner(learner) {
    const query = `
        INSERT INTO Learner
        (Learner_ID, Learner_Full_Name, Learner_Email_Address, Account_Number)
        VALUES (?, ?, ?, ?)
    `;
    
    await db.execute(query, [
        learner.learnerId,
        learner.fullName,
        learner.emailAddress,
        learner.accountNumber
    ])
}

export const findLearnerByAccountNumber = async (accountNumber) => {
  const [rows] = await db.query(
    `SELECT l.*, a.Account_Username, a.Account_Roles, a.Account_Status, a.Account_Password
     FROM Learner l
     JOIN Accounts a ON a.Account_Number = l.Account_Number
     WHERE l.Account_Number = ?
     LIMIT 1`,
    [accountNumber]
  );
  return rows[0] || null;
};

export const updateLearnerProfile = async (accountNumber, fullName) => {
  await db.query(
    `UPDATE Learner SET Learner_Full_Name = ? WHERE Account_Number = ?`,
    [fullName, accountNumber]
  );
};

export const updateAccountPassword = async (accountNumber, hashedPassword) => {
  await db.query(
    `UPDATE Accounts SET Account_Password = ? WHERE Account_Number = ?`,
    [hashedPassword, accountNumber]
  );
};