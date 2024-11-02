import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { query } from "../../../../lib/ConnectDb";
import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: เปลี่ยนรหัสผ่าน
 *     tags:
 *         - Reset-Password
 *     description: เปลี่ยนรหัสผ่าน.
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
 *                        example: Email sent
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function POST(req){
    try {
        const body = await req.json();
        const {email} = body;
        const result = await query(`SELECT * FROM users WHERE email = ?`, [email]);
        if(result.length===0){
            return NextResponse.json({message: "Email not found"},{status: 404});
        }
        if(result){
            const token = jwt.sign({email}, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: "30m" });
            const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
            var transport = nodemailer.createTransport({
                secure:true,
                host:'smtp.gmail.com',
                port:465,
                auth: {
                  user: process.env.MAIL_USER,
                  pass: process.env.MAIL_PASSWORD
                }
              });
              const htmlBody = `<div>
              <h1>HappyMind App Reset Password</h1>
              <h4>Please click on the link below to reset your password</h4>
              <a href= "${process.env.NGROK_URL}/reset-password/${token}">Reset Password</a>
              </div>`
              const info = await transport.sendMail({
                from: "Admin <admin@example.com>",
                to:  email, 
                subject: "Reset Your Password",
                text: "Please reset your password using the link below.",
                html: htmlBody, 
              });
              console.log("Message sent: %s", info.messageId);
              return NextResponse.json({message: "Email sent"},{status: 200});
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
