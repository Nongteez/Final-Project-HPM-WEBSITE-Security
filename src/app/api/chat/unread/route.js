import { query } from "../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const body = await req.json();
        const {id} = body;
        const result = await query(`SELECT * FROM chat WHERE user_to = ? AND is_read = 'false'`, [id]);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}