import db from "../config/db.js";
import { getNextAccountNumber } from "./accountRepository.js";
import bcrypt from "bcryptjs";

export async function generateEmployeeId() {
    try {
        const [rows] = await db.query(`
            SELECT Employee_ID
            FROM Employee
            ORDER BY Employee_ID DESC
            LIMIT 1
        `);
        if (rows.length === 0) {
            return "EMP001";
        }
        const lastId = rows[0].Employee_ID;
        const number = parseInt(lastId.substring(3));
        const newNumber = number + 1;
        const newId = "EMP" + String(newNumber).padStart(3, "0");
        return newId;
    } catch (error) {
        console.error("Error generating employee ID:", error);
        throw error;
    }
}

export async function searchEmployee(keyword) {
    const query =
        `
        SELECT Employee_ID, Employee_Full_Name, Employee_Email_Address, Employee_Phone_Number, Employee_Address
        FROM Employee
        WHERE Employee_ID LIKE ? OR Employee_Full_Name LIKE ? OR Employee_Email_Address LIKE ? OR Employee_Phone_Number LIKE ? OR Employee_Address LIKE ?
        LIMIT 10
    `
    const searchTerm = `%${keyword}%`
    const [rows] = await db.execute(
        query,
        [
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm
        ]
    )
    return rows
}

export async function getAllEmployee() {
    const query =
        `
        SELECT e.Employee_ID, e.Employee_Full_Name, e.Employee_Email_Address, e.Employee_Phone_Number, e.Employee_Gender, e.Employee_Address, e.Employee_DOB,
               a.Account_number, a.Account_Username, a.Account_Status
        FROM Employee e
        JOIN Accounts a ON e.Account_Number = a.Account_Number
        ORDER BY e.Employee_ID
    `
    const [rows] = await db.execute(query);
    return rows;
}

export async function getEmployeeById(id) {
    const query =
        `
        SELECT e.Employee_ID, e.Employee_Full_Name, e.Employee_Email_Address, e.Employee_Phone_Number, e.Employee_Gender, e.Employee_Address, e.Employee_DOB,
               a.Account_Number, a.Account_Username, a.Account_Password, a.Account_Roles, a.Account_Status
        FROM Employee e
        JOIN Accounts a ON e.Account_Number = a.Account_Number
        WHERE e.Employee_ID = ?
    `
    const [rows] = await db.execute(query, [id]);
    return rows[0];
}

export async function insertEmployee(data) {
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
                "Employee",
                "Active"
            ]
        );


        const employeeId = await generateEmployeeId()
        const employeeQuery =
         `
            INSERT INTO Employee
            (
                Employee_ID,
                Employee_Full_Name,
                Employee_Email_Address,
                Employee_Phone_Number,
                Employee_Gender,
                Employee_Address, 
                Employee_DOB,
                Account_Number
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `

        await db.execute(
            employeeQuery,
            [
                employeeId,
                data.name,
                data.email,
                data.phone,
                data.gender,
                data.address,
                data.dob,
                accountId
            ]
        );
    
        await connection.commit
        return {
            employeeId,
            accountId
        };
    } catch (err) {
        await connection.rollback
        throw err
    } finally {
        connection.release
    }
}

export async function updateEmployee(employeeId, status) {
    const query =
        `
        UPDATE Accounts
        SET Account_Status = ?
        WHERE Account_Number = (
            SELECT Account_Number
            FROM Employee
            WHERE Employee_ID = ?
        )
    `
    await db.execute(query, [status, employeeId]);
}