import { query } from "../../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/post/comment/{id}:
 *   delete:
 *     summary: ลบข้อมูลคอมเม้นต์ของโพส์นั้นๆ
 *     tags:
 *         - Post
 *     description: ลบคอมเม้นต์จาก database.
 *     responses:
 *        200:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        await query(`DELETE FROM comments WHERE postId = ?`, [id]);
        return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}