'use server'
import { query } from "../../../../lib/ConnectDb";


export async function GetUserScoreView(email) {
    try {
        const result = await query(`SELECT * FROM userscore_view WHERE email != ?`, [email])

        return result


    } catch (error) {
        return { error: error.message }
    }
}