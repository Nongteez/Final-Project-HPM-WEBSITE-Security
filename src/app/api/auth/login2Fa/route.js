import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(new URL('/login2Fa', process.env.NEXT_PUBLIC_serverURL));
    }
    
    const decode = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    const { email, password } = decode;

    
    const resCsrf = await fetch(process.env.NEXT_PUBLIC_serverURL + '/api/auth/csrf');
    const { csrfToken } = await resCsrf.json();

    const response = await fetch(process.env.NEXT_PUBLIC_serverURL + "/api/auth/callback/credentials", {
      method: "POST",
      body: JSON.stringify({ email, password, csrfToken }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const resSession = await fetch(process.env.NEXT_PUBLIC_serverURL + "/api/auth/session");
      const session = await resSession.json();
      if (session.user) {
        return NextResponse.redirect(new URL('/homepage', process.env.NEXT_PUBLIC_serverURL));
      }
    }

    return NextResponse.redirect(new URL('/login2Fa', process.env.NEXT_PUBLIC_serverURL));
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL('/login2Fa', process.env.NEXT_PUBLIC_serverURL));
  }
}
