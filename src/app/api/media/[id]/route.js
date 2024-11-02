
import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/ConnectDb';



/**
 * @swagger
 * /api/media/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลสื่อ
 *     tags:
 *         - Media
 *     description: แก้ไขข้อมูลสื่อลง database.
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           default: application/json
 *      
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
 *        201:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function PUT(req,{params}){
    try {
       const {id} =params;
       const body = await req.json();
        const {title, url ,content} = body;
         
        await query(`UPDATE media SET title = ?, url = ? , content = ? WHERE id = ?`, [title, url ,content, id]);

        return NextResponse.json({ message: "Media updated successfully" }, { status: 200 });   
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: ลบข้อมูลสื่อ
 *     tags:
 *         - Media
 *     description: ลบข้อมูลสื่อจาก database.
 *     responses:
 *        201:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function DELETE(req,{params}){
    try {   
        const {id} = params;
         await query(`DELETE FROM media WHERE id = ?`, [id]);
        return NextResponse.json({ message: "Media deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
