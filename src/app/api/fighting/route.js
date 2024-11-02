import { NextResponse } from 'next/server'
import { query } from '../../../../lib/ConnectDb'


export async function GET(){
    try {
    const result = await query(`SELECT * FROM quiz`);

        // random id from quiz data
     const length = result.length
     const dataId = []
     for (let i = 0; i < length; i++) {
         dataId.push(result[i].id)
     }
 
     const randomIndex = Math.floor(Math.random() * dataId.length );
     console.log(dataId[randomIndex])

     return NextResponse.json(result[randomIndex]);
    } catch (error) {
        
    }
    

}