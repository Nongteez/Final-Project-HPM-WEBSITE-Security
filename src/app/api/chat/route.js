import { query } from "../../../../lib/ConnectDb";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";



// ฟังก์ชันสำหรับดึงค่า EncryptionKey จากตาราง spk
async function getEncryptionKey() {
    const result = await query('SELECT value FROM spk WHERE keep = "Encryptionkey"');
   
    return result[0].value;  // ดึงค่า key ที่เก็บใน value
}

// ฟังก์ชันสำหรับถอดรหัสข้อความ
function decryptMessage(encryptedMessage, encryptionKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}


export async function GET(req) {
    try {
        // ดึงคีย์สำหรับการถอดรหัสจากฐานข้อมูล
        const encryptionKey = await getEncryptionKey();
       
        // ดึงข้อความแชทจากฐานข้อมูล
        const result = await query(`SELECT * FROM chat`);

        // ถอดรหัสข้อความ
        const decryptedResults = result.map(chat => ({
            ...chat,
            message: decryptMessage(chat.message, encryptionKey)
        }));

        return NextResponse.json(decryptedResults, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: บันทึกข้อความแชท
 *     tags:
 *         - Chat
 *     description: บันทึกข้อความแชทเข้า database.
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
 *               message:
 *                 type: string
 *               from:
 *                 type: string
 *               to:
 *                 type: string  
 *     responses:
 *        201:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function POST(req) {
    try {
        const body = await req.json();
        const { message, from, to } = body;

        // ดึงคีย์สำหรับเข้ารหัสจากฐานข้อมูล
        const encryptionKey = await getEncryptionKey();

        // เข้ารหัสข้อความก่อนบันทึกลงในฐานข้อมูล
        const encryptedMessage = CryptoJS.AES.encrypt(message, encryptionKey).toString();

        // บันทึกข้อความที่เข้ารหัสลงในฐานข้อมูล
        await query("INSERT INTO chat (user_from, user_to, sender, message) VALUES (?, ?, ?, ?)", [from, to, from, encryptedMessage]);

        return NextResponse.json({ message: "Message sent successfully" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}