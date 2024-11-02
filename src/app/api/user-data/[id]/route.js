import { query } from "../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";



/**
 * @swagger
 * /api/user-data/{id}:
 *   get:
 *     summary: ดึงข้อมูลแบบสอบถามส่วนบุคคลของผู้ใช้นั้นๆ
 *     tags:
 *         - User-Data
 *     description: ดึงข้อมูลแบบสอบถามส่วนบุคคลของผู้ใช้นั้นๆ.
 *    
 *     responses:
 *        200:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 *        404:
 *          description: ไม่พบผู้ใช้
 */


export async function GET(request, { params }) {
    try {
        const { id } = params;
    const data = await query(`SELECT * FROM userdata WHERE userId = ?`, [id]);
    if(data.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(data,{status:200});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
}