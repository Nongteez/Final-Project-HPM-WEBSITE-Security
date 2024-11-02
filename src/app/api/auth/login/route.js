import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { query } from "../../../../../lib/ConnectDb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if(!email || !password){
        throw Error("Missing email or password");
    }
    const result = await query(`SELECT * FROM users WHERE email = ?`, [email]);
    const user = result[0];
    if (!user) {
       throw Error("อีเมลไม่ถูกต้อง");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw Error("รหัสผ่านไม่ถูกต้อง");
    }
    

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role_id,
      image: user.image,
    
    } 

    const accessToken = jwt.sign(
      payload,
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "1h" }
    );
    const userNotPassword = {
      id: user.id,
      email: user.email,
      role: user.role_id,
      image: user.image,
      name: user.name,
     
      accessToken
    }
    return NextResponse.json({ message: "Login successful",user:userNotPassword });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
