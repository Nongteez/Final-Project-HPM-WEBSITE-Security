import { query } from "../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";

export async function GET(req,{params}) {
  try {
    const { id } = params;
    const result = await query(`SELECT * FROM quiz WHERE id = ?`, [id]);
    return NextResponse.json(result);
   
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



