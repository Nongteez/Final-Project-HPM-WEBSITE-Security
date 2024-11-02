import { query } from "../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/quiz/check-quiz:
 *   post:
 *     summary: เช็คแบบประเมินว่าเป็นก่อนหรือหลัง
 *     tags:
 *         - Quiz
 *     description: เช็คแบบประเมินว่าเป็นก่อนหรือหลัง.
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
 *                        example: Have a Pre and Post Quiz || Have a Pre Quiz || Have a Post Quiz 
 *        500:
 *          description: ไม่สำเร็จ
 */

export async function POST(req){
    try {
        const body = await req.json();
        const {quizId, userId} = body;

        const preQuiz = await query(`SELECT * FROM userquiz WHERE userId = ? AND quizId = ? AND quizType = "PRE"`, [userId, quizId]);
        const postQuiz = await query(`SELECT * FROM userquiz WHERE userId = ? AND quizId = ? AND quizType = "POST"`, [userId, quizId]);

       if(preQuiz.length > 0 && postQuiz.length > 0){
           return NextResponse.json({message : "Have a Pre and Post Quiz"},{status:201});
       }else if(preQuiz.length > 0){
           return NextResponse.json({message : "Have a Pre Quiz"},{status:201});
       }else if(postQuiz.length > 0){
           return NextResponse.json({message : "Have a Post Quiz"},{status:201});
       }else {
           return NextResponse.json({message : "No Quiz"},{status:200});
       }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}