import { query } from "../../../../lib/ConnectDb";
import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: ดึงข้อมูลโพสต์
 *     tags:
 *         - Post
 *     description: ดึงข้อมูลโพสต์จาก database.
 *     responses:
 *        200:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */


export async function GET(req){
    try {
        const result = await query(`SELECT * FROM full_post_view`);
        return NextResponse.json(result,{status: 200});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: บันทึกข้อมูลโพสต์
 *     tags:
 *         - Post
 *     description: บันทึกโพสต์ลง database.
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
 *     responses:
 *        201:
 *          description: สำเร็จ
 *          content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Post created successfully
 *                      id:
 *                        type: string
 *                        example: 1
 * 
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function POST(req){
    try {
        const body = await req.json()
        const {text, userId} = body
        if(!text || !userId) throw Error("text and userId are required")

        await query(`INSERT INTO post (text, userId) VALUES (?, ?)`, [text, userId]);
        const result = await query(`SELECT post_id FROM post WHERE userId = ? AND text = ?  LIMIT 1`, [userId, text]);
        const id = result[0].post_id
        return NextResponse.json({ message: "Post created successfully", id: id}, { status: 201});


    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}