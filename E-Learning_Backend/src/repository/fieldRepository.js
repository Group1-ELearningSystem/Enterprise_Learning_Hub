import db from "../config/db.js";

export async function loadFields() {
    const query =   
    `
        SELECT Field_Name, Field_Description FROM Fields
    `
    const[rows] = await db.execute(query)
    return rows
}