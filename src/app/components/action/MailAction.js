"use server";
import { query } from "../../../../lib/ConnectDb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function MailAction({ email }) {
   try {
        const data = await query(`SELECT * FROM users WHERE email = ?`, [email]);
        if(data.length === 0) {
            return {message: "User not found"}
        }
        if(data) {
            const token = jwt.sign({ email }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: "30m" });
            const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
            console.log(decoded)
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
              return {message: "Email sent"}
        }

   } catch (error) {
        console.log(error)
        return {message: "Error"}
   }
}


export async function emailToLogin({email,password}) {
  try {
    const data = await query(`SELECT * FROM users WHERE email = ?`, [email]);
        if(data.length === 0) {
            return {message: "User not found"}
        }
    const token = jwt.sign({ email,password  }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: "30m" });
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
    <h1>HappyMind App Login</h1>
    <h4>Please click on the link below to login</h4>
    <a href= "${process.env.NEXT_PUBLIC_serverURL+`/login2Fa/${token}`}">Login</a>
    </div>`
    const info = await transport.sendMail({
      from: "Admin <admin@example.com>",
      to:  email, 
      subject: "Login",
      text: "Please login using the link below.",
      html: htmlBody, 
    });
    console.log("Message sent: %s", info.messageId);
    return {message: "Email sent"}
  } catch (error) {
    console.log(error)
    return {message: "Error"}
   
  }
  
}