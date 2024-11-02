import { NextResponse } from "next/server";
import { query } from "../../../../../../lib/ConnectDb";


export async function PUT(req,{params}){
    try {
        const {id} = params;
        const result = await query(`SELECT * FROM userscore WHERE userId = ?`, [id]);
        const user = result[0];
        
        if(!user){
            return NextResponse.json({status: 400 ,message : "fail"});
        }

        let newStatus = null
        if(user.status === undefined || user.status === "follow" ){
            newStatus = "unfollow"
            await query(`UPDATE userscore SET status = ? WHERE userId = ?`, [newStatus,id]);
            return NextResponse.json({status: 200 ,message : "unfollow"});

        }else if(user.status === "unfollow" || user.status === undefined){
            newStatus = "follow"
            await query(`UPDATE userscore SET status = ? WHERE userId = ?`, [newStatus,id]);
            return NextResponse.json({status: 200,message : "following"});
        }
        

       


    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 });
        
    }
   

}