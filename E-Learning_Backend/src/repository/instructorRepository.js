import db from "../config/db.js"
import bcrypt from "bcryptjs";
import { getNextAccountNumber } from "./accountRepository.js"

export async function generateInstructorId() {
    try {
        const [rows] = await db.query(`
            SELECT Instructor_ID
            FROM Instructor
            ORDER BY Instructor_ID DESC
            LIMIT 1
        `);
        if (rows.length === 0) {
            return "INS001";
        }
        const lastId = rows[0].Instructor_ID;
        const number = parseInt(lastId.substring(3));
        const newNumber = number + 1;
        const newId = "INS" + String(newNumber).padStart(3, "0");
        return newId;
    } catch (error) {
        console.error("Error generating Instructor ID:", error);
        throw error;
    }
}

export async function searchInstructors(keyword) {
    const query =
        `
        SELECT Instructor_ID, Instructor_Full_Name, Instructor_Email_Address, Instructor_Phone_Number
        FROM Instructor
        WHERE Instructor_ID LIKE ? OR Instructor_Full_Name LIKE ? OR Instructor_Email_Address LIKE ? OR Instructor_Phone_Number LIKE ?
        LIMIT 10
    `
    const searchTerm = `%${keyword}%`
    const [rows] = await db.execute(
        query,
        [
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm
        ]
    )
    return rows
}

export async function getAllInstructors() {
    const query =
        `
        SELECT i.Instructor_ID, i.Instructor_Full_Name, i.Instructor_Email_Address, i.Instructor_Phone_Number, a.Account_number,
               a.Account_Username, a.Account_Status
        FROM Instructor i
        JOIN Accounts a ON i.Account_Number = a.Account_Number
        ORDER BY i.Instructor_ID
    `
    const [rows] = await db.execute(query);
    return rows;
}

export async function getInstructorById(id) {
    const query =
        `
        SELECT i.Instructor_ID, i.Instructor_Full_Name, i.Instructor_Email_Address, i.Instructor_Phone_Number, a.Account_number,
               a.Account_Username, a.Account_Username, a.Account_Status, a.Account_Password
        FROM Instructor i
        JOIN Accounts a ON i.Account_Number = a.Account_Number
        WHERE i.Instructor_ID = ?
    `
    const [rows] = await db.execute(query, [id]);
    return rows[0];
}

export async function insertInstructor(data) {
    const connection = await db.getConnection
    try {
        await connection.beginTransaction
        const accountId = await getNextAccountNumber()
        const defaultPassword = "Temp@123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const accountQuery =
        `
            INSERT INTO Accounts
            (Account_Number, Account_Username, Account_Password, Account_Roles, Account_Status)
            VALUES (?, ?, ?, ?, ?)
        `

        await db.execute(
            accountQuery,
            [
                accountId,
                data.email,
                hashedPassword,
                "Instructor",
                "Active"
            ]
        );


        const instructorId = await generateInstructorId()
        const instructorQuery =
         `
            INSERT INTO Instructor
            (
                Instructor_ID,
                Instructor_Full_Name,
                Instructor_Email_Address,
                Instructor_Phone_Number,
                Account_Number
            )
            VALUES (?, ?, ?, ?, ?)
        `

        await db.execute(
            instructorQuery,
            [
                instructorId,
                data.name,
                data.email,
                data.phone,
                accountId
            ]
        );
    
        await connection.commit
        return {
            instructorId,
            accountId
        };
    } catch (err) {
        await connection.rollback
        throw err
    } finally {
        connection.release
    }
}

export async function updateInstructor(instructorId, data) {
    const {name, email, phone, status} = data
    const connection = await db.getConnection
    try {

        await connection.beginTransaction
        await db.execute(
            `
            UPDATE Instructor
            SET 
                Instructor_Full_Name = ?,
                Instructor_Email_Address = ?,
                Instructor_Phone_Number = ?
            WHERE Instructor_ID = ?
            `,
            [name, email, phone, instructorId]
        );

        await db.execute(
            `
            UPDATE Accounts
            SET Account_Status = ?
            WHERE Account_Number = (
                SELECT Account_Number
                FROM Instructor
                WHERE Instructor_ID = ?
            )
            `,
            [status, instructorId]
        );

        await connection.commit
    } catch (err) {
        await connection.rollback
        throw err
    } finally {
        connection.release
    }
}