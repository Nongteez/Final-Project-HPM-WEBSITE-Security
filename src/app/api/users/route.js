import { query } from "../../../../lib/ConnectDb";
import { NextResponse } from "next/server";
import fs from 'node:fs/promises'

export async function GET(req){
   
    try {
       
         const result = await query(`SELECT * FROM users`);
        if(result.length < 1) return NextResponse.json({message: "No user found"},{status: 400});
        return NextResponse.json(result);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
