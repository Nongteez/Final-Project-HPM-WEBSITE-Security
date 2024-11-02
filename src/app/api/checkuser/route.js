import { NextResponse } from "next/server";
import { query } from "../../../../lib/ConnectDb";

export async function POST(req) {
    try {
       
        const {email} = await req.json();
       
        const result  = await  query(`SELECT * FROM users WHERE email = ?`, [email]);
        const  hasEmail = result[0];
       return NextResponse.json({hasEmail});
        

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }




}
