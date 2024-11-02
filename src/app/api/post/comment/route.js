import { query } from "../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/post/comment:
 *   post:
 *     summary: บันทึกข้อมูลคอมเม้นต์
 *     tags:
 *         - Post
 *     description: บันทึกคอมเม้นต์ลง database.
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           default: application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               userId:
 *                 type: string
 *               postId:
 *                 type: string
 * 
 *     responses:
 *        201:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function POST(req){
    try {
        const body = await req.json()
        const {text, userId, postId} = body
        if(!text || !userId || !postId) throw Error("text and userId are required")
        
        await query(`INSERT INTO comments (text, userId, postId) VALUES (?, ?, ?)`, [text, userId, postId])
        return NextResponse.json({ message: "Comment created successfully" }, { status: 201 })


    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}