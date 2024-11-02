import { query } from "../../../../lib/ConnectDb";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
/**
 * @swagger
 * /api/user-data:
 *   post:
 *     summary: เพิ่มข้อมูลแบบสอบถามส่วนบุคคล
 *     tags:
 *         - User-Data
 *     description: เพิ่มข้อมูลแบบสอบถามส่วนบุคคลลง database.
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
 *                 example: 33
 *               gender:
 *                 type: string
 *                 example: ชาย
 *               age:
 *                 type: number
 *                 example: 20-25 ปี
 *               education:
 *                 type: string
 *                 example: ปี 1
 *               faculty:
 *                 type: string
 *                 example: สำนักศาสตร์และศิลป์ดิจิทัล
 *               major:
 *                 type: string
 *                 example: ดิจิเทค
 *               religion:
 *                 type: string
 *                 example: พุทธ
 *               disease:
 *                 type: string
 *                 example: ไม่มี
 *               ph:
 *                 type: string
 *                 example: ไม่มี
 *               mh:
 *                 type: string
 *                 example: ไม่มี
 *               nearby:
 *                 type: string
 *                 example: ไม่มี
 *               nearby_relation:
 *                 type: string
 *                 example: ไม่มี
 *
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

async function getEncryptionKey() {
  const result = await query(
    'SELECT value FROM spk WHERE keep = "Encryptionkey"'
  );

  return result[0].value; // ดึงค่า key ที่เก็บใน value
}

const Encryption = (item, key) => {
  return CryptoJS.AES.encrypt(item, key).toString();
};

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      gender,
      age,
      education,
      faculty,
      major,
      religion,
      disease,
      ph,
      mh,
      nearby,
      nearby_relation,
    } = body;
    const encryptionKey = await getEncryptionKey();
    console.log('Encrypted Data:', [
        Encryption(gender, encryptionKey),
        Encryption(age, encryptionKey),
        Encryption(education, encryptionKey),
        Encryption(faculty, encryptionKey),
        Encryption(major, encryptionKey),
        Encryption(religion, encryptionKey),
        Encryption(disease, encryptionKey),
        Encryption(ph, encryptionKey),
        Encryption(mh, encryptionKey),
        Encryption(nearby, encryptionKey),
        Encryption(nearby_relation, encryptionKey),
      ]);
      

    await query(
      `INSERT INTO userdata (userId ,gender,age ,education,faculty,major ,religion,disease,physical_health,mental_health,nearby,nearby_relation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) `,
      [
        userId,
        Encryption(gender,encryptionKey),
        Encryption(age,encryptionKey),
        Encryption(education,encryptionKey),
           Encryption(faculty,encryptionKey),
        Encryption(major,encryptionKey),
           Encryption(religion,encryptionKey),
           Encryption(disease,encryptionKey),
           Encryption(ph,encryptionKey),
           Encryption(mh,encryptionKey),
           Encryption(nearby,encryptionKey),
           Encryption(nearby_relation,encryptionKey),
      ]
    );

    return NextResponse.json({ message: "Success", body }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
