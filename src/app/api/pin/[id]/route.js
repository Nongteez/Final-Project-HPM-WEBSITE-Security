import { NextResponse } from "next/server";
import { query } from "../../../../../lib/ConnectDb";
import bcrypt from "bcrypt";


export async function PUT(req,{params}) {
    try {
        const {id} = params;
        const body = await req.json();
        const {pin} = body;
        const hashPin = await bcrypt.hash(pin, 8);
        await query(`UPDATE users SET pin = ? WHERE id = ?`, [hashPin, id]);
        return NextResponse.json({ message: "Pin updated successfully" }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }





}
export async function POST(req,{params}) {
    try {
        const {id} =params;
        const body = await req.json();
        const {pin} = body;
        
        const result = await query('SELECT pin FROM users WHERE id = ?', [id]);
        const userPin = result[0].pin;
        
        const isMatch = await bcrypt.compare(pin, userPin);
        if (isMatch) {
            return NextResponse.json({ message: "Pin matched"  }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Pin not matched" }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
}
