import { query } from "../../../../../../lib/ConnectDb";
import { NextResponse } from "next/server";
import fs from 'fs/promises'


export async function PUT(req,{params}) {
    try {
        const {id} = params;
        if(!id){
            throw Error("Missing id");
        }
        
        const file = await req.formData();
        const video = file.get('video');

        if(video.size > 104857600){
            // size less than 2.5MB
            throw Error("ไฟล์ต้องมีขนาดน้อยกว่า 100 MB")
        }
       
        const allowedTypes = ['video/mp4'];

        if (!allowedTypes.includes(video.type)) {
                throw Error("ไฟล์ต้องเป็นนามสกุล .mp4");
            }

       
        const fileName = `video-post-${id}.mp4`;


        
        const videoBuffer = await video.arrayBuffer();
        const buffer = Buffer.from(videoBuffer);

       
            

        
        await fs.writeFile(`./public/post/uploads/video/${fileName}`, buffer);
        const videoUrl = `/post/uploads/video/${fileName}`

        await query(`UPDATE post SET video = ? WHERE id = ?`, [videoUrl, id]);
        return NextResponse.json({ message: "success" }, { status: 200 });
       
    } catch (error) {
        
    }
}


export async function DELETE(req, { params }) {
    try {
      const { id } = params;
  
      const pathMp4 = `./public/post/uploads/posts/video/video-post-${id}.mp4`;
  
      try {
        await fs.access(pathMp4);
        await fs.unlink(pathMp4);
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