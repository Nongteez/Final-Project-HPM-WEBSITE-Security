import { NextResponse } from "next/server";
import { query } from "../../../../../../lib/ConnectDb";


export async function DELETE(req,{params}) {

    const { id } = params;

    try {
        await query(`DELETE FROM users WHERE id = ?`, [id]);
        await query(`DELETE FROM userscore WHERE userId = ?`, [id]);
        await query(`DELETE FROM userquiz WHERE userId = ?`, [id]);
        await query(`DELETE FROM userdata WHERE userId = ?`, [id]);
        await query(`DELETE FROM post WHERE userId = ?`, [id]);
        await query(`DELETE FROM comments WHERE userId = ?`, [id]);
        await query(`DELETE FROM chat WHERE  user_from = ? OR user_to = ? `, [id, id]);
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}