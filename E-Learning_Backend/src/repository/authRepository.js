import db from "../config/db.js";

export const findAccountForLogin = async (username) => {
  const [rows] = await db.query(
    `SELECT
        a.Account_Number,
        a.Account_Username,
        a.Account_Password,
        a.Account_Roles,
        a.Account_Status,
        l.Learner_ID,
        l.Learner_Full_Name,
        l.Learner_Email_Address
     FROM Accounts a
     LEFT JOIN Learner l ON l.Account_Number = a.Account_Number
     WHERE a.Account_Username = ?
     LIMIT 1`,
    [username]
  );

  return rows[0] || null;
};

