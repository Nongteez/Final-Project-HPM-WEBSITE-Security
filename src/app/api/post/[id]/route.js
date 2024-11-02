
import { query } from "../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     summary: ลบข้อมูลโพสต์
 *     tags:
 *         - Post
 *     description: ลบโพสต์จาก database.
 *     responses:
 *        200:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function DELETE(req,{params}){

    const { id } = params;
    try {
        await query(`DELETE FROM post WHERE post_id = ?`, [id]);
        
        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}