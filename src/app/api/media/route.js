import { NextResponse } from "next/server";
import { query } from "../../../../lib/ConnectDb";

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: เรียกดูข้อมูลสื่อ
 *     tags:
 *         - Media
 *     description: ส่งข้อมูลสื่อให้ความรู้ทั้งหมด
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       
 */



export async function GET(){
    try {
        const result = await query(`SELECT * FROM media`);
        if(result.length < 1) return NextResponse.json({message: "No media found"},{status: 400});
        return NextResponse.json(result,{status: 200});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}

/**
 * @swagger
 * /api/media:
 *   post:
 *     summary: เพิ่มข้อมูลสื่อ
 *     tags:
 *         - Media
 *     description: เพิ่มข้อมูลสื่อ.
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
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               content:
 *                 type: string  
 *     responses:
 *       201:
 *         description: เพิ่มสื่อสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Media created successfully
 *                 mediaId:
 *                   type: string
 *                   example: "1"
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req){
    try {
        const body = await req.json();
        const {title, url ,content} = body;
        const result = await query(`SELECT id FROM media WHERE title = ?`, [title]);
        if(result.length > 0)  throw Error("Media title already exists");

        if(content){
            await query(`INSERT INTO media (title, url, content) VALUES (?, ?, ?)`, [title, url,content]);
            const result = await query(`SELECT id FROM media WHERE title = ? AND url = ? AND content = ?`, [title, url,content]);
            const mediaId = result[0].id;
           return NextResponse.json({ message: "Media created successfully", id: mediaId }, { status: 201 });
        }else{
            await query(`INSERT INTO media (title, url) VALUES (?, ?)`, [title, url]);
            const result = await query(`SELECT id FROM media WHERE title = ? AND url = ?`, [title, url]);
            const mediaId = result[0].id;
           return NextResponse.json({ message: "Media created successfully", id: mediaId }, { status: 201 });
        }
       
       
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
