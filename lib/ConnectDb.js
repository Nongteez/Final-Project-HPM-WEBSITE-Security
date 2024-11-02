import mysql from 'mysql2/promise'; // npm install mysql2 package ที่เอาไว้เชื่อม database


export const pool = mysql.createPool({
    host: process.env.DB_HOST, // ถ้าเป็นปกติก็ใส่ 'localhost'
    user: process.env.DB_USER, // 'root'
    password: process.env.DB_PASSWORD, // ''
    database: process.env.DB_DATABASE, // 'ชื่อฐานข้อมูล'
    connectionLimit:100 // อันนี้เป็นจำนวนการเชื่อมต่อในช่วงเวลานึง ไม่เกิน 100
});

export const query = async (sql, params) => { // ฟังชั่น query 
  try {
    const [rows] = await pool.query(sql, params); // จะรับ sql syntax และ parameter เช่นตัวอย่างข้่างล่าง
    
    return rows;
  } catch (error) {
    console.error('Database query error:', error.message); // ถ้ามี error 
     throw new Error('Database query failed '+error.message);
  }
   
  };


