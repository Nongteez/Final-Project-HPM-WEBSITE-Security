import { query } from "../../../../lib/ConnectDb";
import {NextResponse} from "next/server";


/**
 * @swagger
 * /api/quiz:
 *   get:
 *     summary: ดึงข้อมูลแบบประเมิน
 *     tags:
 *         - Quiz
 *     description: ดึงข้อมูลแบบประเมินจาก database.
 *     responses:
 *        201:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function GET(req){
    try {
    const result = await query(`SELECT * FROM quiz`);

   

    return NextResponse.json(result,{status: 200});

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
}



/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: บันทึกข้อมูลแบบประเมิน
 *     tags:
 *         - Quiz
 *     description: บันทึกข้อมูลแบบประเมินลง database.
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           default: application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               quizId:
 *                 type: string
 *               quizType:
 *                 type: string
 *               answers:
 *                 type: array
 *               pressure:
 *                 type: number
 *               encouragement:
 *                 type: number
 *               obstacle:
 *                 type: number
 *               total:
 *                 type: number
 *               risk:
 *                 type: string
 * 
 * 
 * 
 *     responses:
 *        201:
 *          description: สำเร็จ
 *          content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: Success
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function POST(req) {
    try {
     

      const body = await req.json();
      const {userId ,quizId ,quizType,answers,pressure,encouragement,obstacle,total,risk} = body;
      // quiz 7 = rq20 and 8 = rq3 quiz 6 = mhl29
      if(quizId==7){
        await query(`INSERT INTO userquiz (userId ,quizId ,quizType,answers,pressure,encouragement,obstacle,total,risk) VALUES (?,?,?,?,?,?,?,?,?)`,[userId,quizId,quizType,JSON.stringify(answers),pressure,encouragement,obstacle,total,risk])
        if(quizType=="PRE"){
          await query(`UPDATE userscore SET preRq20=? WHERE userId=?`,[total,userId])
        }else if(quizType=="POST"){
          await query(`UPDATE userscore SET postRq20=? WHERE userId=?`,[total,userId])
        }
        return NextResponse.json({message : "Success"},{status:201});
      }
      if(quizId==8||quizId==6){
        await query(`INSERT INTO userquiz (userId ,quizId ,quizType,answers,total,risk) VALUES (?,?,?,?,?,?)`,[userId,quizId,quizType,JSON.stringify(answers),total,risk])
        if(quizType=="PRE" && quizId==8){
          await query(`UPDATE userscore SET preRq3=? WHERE userId=?`,[total,userId])
        }else if(quizType=="POST" && quizId==8){
          await query(`UPDATE userscore SET postRq3=? WHERE userId=?`,[total,userId])
        }
        return NextResponse.json({message : "Success"},{status:201});
      }
      
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
      
    }



}