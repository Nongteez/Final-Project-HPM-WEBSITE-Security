'use server'
import { query } from "../../../../lib/ConnectDb";


export async function UpdateStatusUser(id){
    try {
       
        const result = await query(`SELECT * FROM userscore WHERE userId = ?`, [id]);
        const user = result[0];
        
        if(!user){
            return { message : "not found"};
        }

        let newStatus = null
        if(user.status === "follow" ){
            newStatus = "unfollow"
            await query(`UPDATE userscore SET status = ? WHERE userId = ?`, [newStatus,id]);
            return {message : "unfollow success"};

        }else if(user.status === "unfollow"){
            newStatus = "follow"
            await query(`UPDATE userscore SET status = ? WHERE userId = ?`, [newStatus,id]);
            return {message : "following success"};
        }
    } catch (error) {
        console.log(error)
        return { error: error.message };
        
    }
   

}