"use server"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { query } from "../../../../lib/ConnectDb";


export async function UpdatePassword({password, token}) {
    
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    const email = decoded.email;

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        await query(`UPDATE users SET password = ? WHERE email = ?`, [hashPassword, email]);

        return {message: "Password updated successfully"}

    } catch (error) {
        console.log(error)

        return {message: "Something went wrong"}
    }
    

}