import { query } from "../../../../lib/ConnectDb";

export async function GetUserData(){
    try {
        const result = await query(`SELECT * FROM users`);
        if(result.length < 1) return { error: "No user found" };
        return { data: result };
    } catch (error) {
        return { error: error.message };
    }
}