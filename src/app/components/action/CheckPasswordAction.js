'use server'
import { query } from "../../../../lib/ConnectDb";
import bcrypt from "bcrypt";

export async function CheckPasswordAction({ email,password }) {
    try {
        const result = await query(`SELECT * FROM users WHERE email = ?`, [email]);
        const passwordDatabase = result[0].password;

        const isPasswordValid = await bcrypt.compare(password, passwordDatabase);
        if(!isPasswordValid){
            return {message: "รหัสผ่านไม่ถูกต้อง"}
        }

        return {message: "ตรวจสอบรหัสผ่านสําเร็จ"}

    } catch (error) {
        return { error: error.message };
    }



}
    