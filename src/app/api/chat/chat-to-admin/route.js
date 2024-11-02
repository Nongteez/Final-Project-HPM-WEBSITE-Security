import { query } from "../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";


async function getEncryptionKey() {
    const result = await query('SELECT value FROM spk WHERE keep = "Encryptionkey"');
   
    return result[0].value;  // ดึงค่า key ที่เก็บใน value
}




// ฟังก์ชันสำหรับถอดรหัสข้อความ
function decryptMessage(encryptedMessage, encryptionKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}



export async function POST(req) {
    try {
        const body =await req.json()
        const {message,from} = body

        const result = await query(`SELECT id FROM users WHERE role_id = 1`);
        const encryptionKey = await getEncryptionKey();
        const encryptedMessage = CryptoJS.AES.encrypt(message, encryptionKey).toString();

        for (let i = 0; i < result.length; i++) {
            const to = result[i].id;
            await query(`INSERT INTO chat (user_from,user_to,sender,message) VALUES (?, ?, ?,?)`, [from, to, from, encryptedMessage]);
        }

        return NextResponse.json({ message: "Message sent successfully"}, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
