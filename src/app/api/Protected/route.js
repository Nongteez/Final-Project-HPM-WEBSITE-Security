import { getToken } from "next-auth/jwt";
import { VerifyToken } from "../../../../lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const authorizationHeader = req.headers.get("authorization");

  if (!authorizationHeader) {
    return NextResponse.json({ message: "No token found" }, { status: 401 });
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "No token found" }, { status: 401 });
  }

  const decoded = VerifyToken(token);

  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("JSON Web Token", token);
  console.log("Decoded Token", decoded);
  return NextResponse.json({ message: "Protected content", user: decoded });
}