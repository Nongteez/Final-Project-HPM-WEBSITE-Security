import { NextResponse } from "next/server";
import { query } from "../../../../lib/ConnectDb";


export async function GET(req) {
    try {
        const result = await query(`SELECT * FROM userquiz_view`);
        return NextResponse.json(result);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}