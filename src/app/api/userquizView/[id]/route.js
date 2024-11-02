import { NextResponse } from "next/server";
import { query } from "../../../../../lib/ConnectDb";


/**
 * @swagger
 * /api/userquizView/{id}:
 *   get:
 *     summary: ดึงข้อมูลการทำแบบประเมินของผู้ใช้คนนั้นๆ
 *     tags:
 *         - UserQuizView
 *     description: งข้อมูลการทำแบบประเมินของผู้ใช้คนนั้นๆ.
 *    
 *     responses:
 *        200:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function GET(req,{params}) {
    try {
        const {id} = params;
        const result = await query(`SELECT * FROM userquiz_view WHERE userId = ?`, [id]);
        return NextResponse.json(result,{status:200});

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}