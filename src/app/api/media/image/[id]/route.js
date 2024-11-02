import { NextResponse } from "next/server";
import { query } from "../../../../../../lib/ConnectDb";
import fs from 'node:fs/promises'
import sharp from "sharp";

/**
 * @swagger
 * /api/media/image/{id}:
 *   put:
 *     summary: เพิ่มรูปภาพสื่อ
 *     tags:
 *         - Media
 *     description: บันทึกรูปภาพสื่อลงเครื่อง sever
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           default: multipart/form-data
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           default: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: ไฟล์
 *                 default:
 *                   filename: video.mp4
 *                   mimetype: video/mp4
 *                   encoding: "7bit"
 *                   size: 104857600
 *                   data: ArrayBuffer
 *     responses:
 *        200:
 *          description: สำเร็จ
 *          
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

        if(image.size > 5242880){
            // size less than 2.5MB
            throw Error("ไฟล์ต้องมีขนาดน้อยกว่า 5 MB")
        }
       
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!allowedTypes.includes(image.type)) {
                throw Error("ไฟล์ต้องเป็นนามสกุล .jpg หรือ .png");
            }

       
        const fileName = `media-${id}.jpg`;


        
        const imageBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);

        let finalBuffer
        if(image.type === 'image/png'){
            finalBuffer = await sharp(buffer).jpeg({quality: 90}).toBuffer();
        }else{
            finalBuffer = buffer
        }
            

        
        await fs.writeFile(`./public/media/uploads/image/${fileName}`, finalBuffer);
        const imageUrl = `/media/uploads/image/${fileName}`

        await query(`UPDATE media SET image = ? WHERE id = ?`, [imageUrl, id]);
        return NextResponse.json({ message: "success" }, { status: 200 });
       

       
        

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req,{params}) {
    try {
        const {id} = params;
        

        const pathJpg = `./public/media/uploads/image/media-${id}.jpg`;
        

        
        try {
            await fs.access(pathJpg);
            await fs.unlink(pathJpg);
            await query(`UPDATE media SET image = NULL WHERE id = ?`, [id]);
        } catch (err) {
            return NextResponse.json({ message: "success" }, { status: 200 });
            
        }finally{
            return NextResponse.json({ message: "success" }, { status: 200 });
        }   
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
        
    }
}