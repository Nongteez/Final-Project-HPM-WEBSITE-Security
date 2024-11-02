import { query } from "../../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs/promises";


/**
 * @swagger
 * /api/post/image/{id}:
 *   put:
 *     summary: บันทึกรูปภาพ
 *     tags:
 *         - Post
 *     description: บันทึกรูปภาพลงเครื่อง server.
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
 *                 description: ไฟล์รูปภาพ
 * 
 * 
 *     responses:
 *        200:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */


export async function PUT(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      throw Error("Missing id");
    }

    const file = await req.formData();
    const image = file.get("image");

    if (image.size > 5242880) {
      // size less than 2.5MB
      throw Error("ไฟล์ต้องมีขนาดน้อยกว่า 5 MB");
    }

    const allowedTypes = ["image/jpeg", "image/png" ,"image/jpg"];

    if (!allowedTypes.includes(image.type)) {
      throw Error("ไฟล์ต้องเป็นนามสกุล .jpg หรือ .png");
    }

    const fileName = `post-${id}.jpg`;

    const imageBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    let finalBuffer;
    if (image.type === "image/png") {
      finalBuffer = await sharp(buffer).jpeg({quality: 90}).toBuffer();
    } else {
      finalBuffer = buffer;
    }

    await fs.writeFile(`./public/post/uploads/posts/image/${fileName}`, finalBuffer);
    const imageUrl = `/post/uploads/posts/image/${fileName}`;

    await query(`UPDATE post SET image = ? WHERE post_id = ?`, [imageUrl, id]);
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



/**
 * @swagger
 * /api/post/image/{id}:
 *   delete:
 *     summary: ลบรูปภาพ
 *     tags:
 *         - Post
 *     description: ลบรูปภาพจากเครื่อง server.
 *     responses:
 *        200:
 *          description: สำเร็จ
 *        500:
 *          description: ไม่สำเร็จ
 */


export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const pathJpg = `./public/post/uploads/posts/image/post-${id}.jpg`;

    try {
      await fs.access(pathJpg);
      await fs.unlink(pathJpg);
    } catch (err) {
      return NextResponse.json({ message: "success" }, { status: 200 });
    } finally {
      return NextResponse.json({ message: "success" }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
