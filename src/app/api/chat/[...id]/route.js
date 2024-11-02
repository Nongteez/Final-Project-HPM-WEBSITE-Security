import { NextResponse } from "next/server";
import { query } from "../../../../../lib/ConnectDb";
import CryptoJS from "crypto-js";


/**
 * @swagger
 * /api/chat/{from}/{to}:
 *   get:
 *     summary: ดึงข้อความแชทของคนๆนั้น
 *     tags:
 *         - Chat
 *     description: ดึงข้อความแชทของคนๆนั้นจาก database | ${from} คือ id คนส่งข้อความ,${to} คนรับข้อความ (admin) หรือใส่สลับกันได้ไม่มีปํญหา แต่หลักๆต้องมี id 9 คือแอดมิน.
 *     responses:
 *        200:
 *          description: สำเร็จ
 *          
 *        500:
 *          description: ไม่สำเร็จ
 */



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

export async function GET(req,{params}) {
    try {
        const { id } = params;
        const string = id.toString();
        const from = string.split(',')[0];
        const to = string.split(',')[1];

        const encryptionKey = await getEncryptionKey();

       const result = await query(`SELECT * FROM chat_view WHERE (user_from = ? AND user_to = ?) OR (user_from = ? AND user_to = ?) ORDER BY create_at ASC`, [from, to,to,from]);
       if(result.length == 0) return NextResponse.json({message: "No messages found"},{status: 400});
       
       const message = result.map((item) => {
            return {
                id: item.id,
                message:  decryptMessage(item.message, encryptionKey),
                sender:item.sender,
                fromSelf:  item.user_from.toString() == from,
                createAt : item.create_at,
                image: item.image
            }
        })



        return NextResponse.json({message},{status: 200});
        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req,{params}) {
    try {
        const { id } = params;
        const string = id.toString();
        const from = string.split(',')[0];
        const to = string.split(',')[1];
    
        await query(`
          UPDATE chat
          SET is_read = 'true'
            WHERE (user_from = ? AND user_to = ?) OR (user_from = ? AND user_to = ?) AND is_read = 'false'
        `, [from, to, to, from]);
    
        return NextResponse.json({ message: "Messages marked as read" }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}