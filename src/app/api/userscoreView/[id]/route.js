import { NextResponse } from "next/server";
import { query } from "../../../../../lib/ConnectDb";



export async function GET(req, { params }) {
    const { id } = params;
    try {
        const result = await query(`SELECT * FROM userscore_view WHERE id = ?`, [id]);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}