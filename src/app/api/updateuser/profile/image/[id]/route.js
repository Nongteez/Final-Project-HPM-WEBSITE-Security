import { NextResponse } from "next/server";
import { query } from "../../../../../../../lib/ConnectDb";
import fs from 'node:fs/promises'
import sharp from "sharp";

/**
 * @swagger
 * /api/updateuser/profile/image/{id}:
 *   put:
 *     summary: อัพเดตรูปภาพผู้ใช้ (ตัวเอง)
 *     tags:
 *         - Update-User
 *     description: อัพเดตรุปภาพผู้ใช้.
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           default: multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: รูปภาพ
 * 
 *     responses:
 *        200:
 *          description: สำเร็จ
 *          content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                        example: success
 *        500:
 *          description: ไม่สำเร็จ
 */


export async function PUT(req,{params}) {
    try {
        const {id} = params;
        if(!id){
            throw Error("Missing id");
        }
        const file = await req.formData();
        const image = file.get('image');

        if(image.size > 2621440){
            throw Error("The file must be less than 2.5MB")
        }
       
        const allowedTypes = ['image/jpeg', 'image/png'];

        if (!allowedTypes.includes(image.type)) {
            throw Error("The file must be a .jpg or .png")
            }

        
       

        
        const imageBuffer = await image.arrayBuffer();
        const buffer = new Buffer.from(imageBuffer);
        const fileName = `user-${id}.jpg`;


        let finalBuffer
        if(image.type === 'image/png'){
            finalBuffer = await sharp(buffer).jpeg({quality: 90}).toBuffer();
        }else{
            finalBuffer = buffer;
        }






        
        await fs.writeFile(`./public/profile/uploads/${fileName}`, finalBuffer);
        const imageURL = `/profile/uploads/${fileName}`
        await query(`UPDATE users SET image = ? WHERE id = ?`, [imageURL, id]);
        return NextResponse.json({ message: "success" }, { status: 200 });
       

       
        

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}





export async function DELETE(req,{params}) {
    try {
        const {id} = params;
        const pathJpg = `./public/profile/uploads/user-${id}.jpg`
        try {
            await fs.access(pathJpg);
            await fs.unlink(pathJpg);
        } catch (err) {
            return NextResponse.json({ message: "success" }, { status: 200 });
           
        }finally{
            return NextResponse.json({ message: "success" }, { status: 200 });
        }
       
        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}