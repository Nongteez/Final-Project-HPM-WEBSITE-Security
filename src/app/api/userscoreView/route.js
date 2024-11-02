import { NextResponse } from "next/server";
import { query } from "../../../../lib/ConnectDb";

export async function POST(req) {
    try {
        const body = await req.json()
        const {email} = body
        const result = await query(`SELECT * FROM userscore_view WHERE email != ?`, [email])

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }



}