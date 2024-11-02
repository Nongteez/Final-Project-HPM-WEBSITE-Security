import { query } from "../../../../lib/ConnectDb";
import {VerifyToken} from "../../../../lib/auth";
import { NextResponse } from "next/server";


export async function POST(req){
    
    const authorization = req.headers.get("authorization")
    

        try {
            if(!authorization){
               throw Error("No accessToken in headers")
            }
        
            const token = authorization.split(" ")[1]
        
            if(!token){
                throw Error("No accessToken")
            }
        
            const user =  VerifyToken(token)
        
            if(!user){
                throw Error("Invalid token")
            }
        
            const result = await query(`SELECT id, name,first_name,last_name,gender,dob, email, role_id, image FROM users WHERE id = ?`, [user.id])
        
            return NextResponse.json(result[0])
        } catch (error) {
            return NextResponse.json({error: error.message}, {status: 500})
        }
    
    }