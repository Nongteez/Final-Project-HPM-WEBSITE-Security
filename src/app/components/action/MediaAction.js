
'use server'
import { query } from "../../../../lib/ConnectDb";
import { NextResponse } from "next/server";

export async function GetMediaData() {
        try {
            const result = await query(`SELECT * FROM media`);
            if(result.length < 1) return { error: "No media found" };
            return { data: result };
        } catch (error) {
            return { error: error.message };
        }
}