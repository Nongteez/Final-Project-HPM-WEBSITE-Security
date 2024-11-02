import { query } from "../../../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";



/**
 * @swagger
 * /api/updateuser/profile/data/{id}:
 *   put:
 *     summary: อัพเดตข้อมูลผู้ใช้ (ตัวเอง)
 *     tags:
 *         - Update-User
 *     description: อัพเดตข้อมูลผู้ใช้.
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *        200:
 *          description: สำเร็จ
 *          content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: User updated successfully
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function PUT(req,{params}) {
    try {
        const { id } = params;
        const body = await req.json();
        const {name,email,role} = body;
        if(!role){
            await query(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name,email,id]);
            return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
        }
        await query(`UPDATE users SET name = ?, email = ?, role_id = ? WHERE id = ?`, [name,email,role,id]);
        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

