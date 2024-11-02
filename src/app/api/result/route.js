import { query } from "../../../../lib/ConnectDb";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        const result = await query(`SELECT * FROM full_userquiz_view`);
        if(result.length < 1) return NextResponse.json({message: "No result found"},{status: 400});
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
    
       