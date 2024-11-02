import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { query } from '../../../../../lib/ConnectDb'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { getToken } from 'next-auth/jwt'
import GoogleProvider from "next-auth/providers/google";
import { signIn, signOut } from 'next-auth/react'


/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: การล็อกอิน
 *   - name: Chat
 *     description: แชท
 *   - name: Media
 *     description: สื่อ
 *   - name: Post
 *     description: โพสต์ชุมชน
 *   - name: Quiz
 *     description: แบบประเมิน
 *   - name: Register
 *     description: สมัครสมาชิก
 *   - name: Reset-Password
 *     description: เปลี่ยนหัสผ่าน
 *   - name: Update-User
 *     description: อัพเดตข้อมูลส่วนตัว
 *   - name: User-Data
 *     description: ข้อมูลแบบสอบถามส่วนบุคคล
 *   - name: UserQuizView
 *     description: ข้อมูลแบบประเมินที่ผู้ใช้ทำ
 *  
 */


/**
 * @swagger
 * /api/auth/csrf: 
 *   get:
 *     summary: token csrf
 *     tags:
 *         - Authentication
 *     description: ขอ token เพื่อยืนยันการการร้องขอ api มาจากเราอย่างถูกต้อง
 *     responses:
 *           200:
 *            description: สำเร็จ
 */

/**
 * @swagger
 * /api/auth/session: 
 *   get:
 *     summary: ดึงข้อมูล session
 *     tags:
 *         - Authentication
 *     description: ขอ session เพื่อดูว่า user อยู่ในระบบหรือยัง
 *     responses:
 *           200:
 *            description: สำเร็จ
 */

/**
 * @swagger
 * /api/auth/signout: 
 *   post:
 *     summary: ออกจากระบบ
 *     tags:
 *         - Authentication
 *     description: ออกจากระบบ
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           default: application/json
 *      
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               csrfToken:
 *                 type: string 
 *     responses:
 *           200:
 *            description: สำเร็จ
 */

/**
 * @swagger
 * /api/auth/callback/credentials:
 *   post:
 *     summary: ล็อกอินเข้าส่ระบบ
 *     tags:
 *        - Authentication
 *     description: ล็อกอินเข้าส่ระบบ.
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           default: application/json
 *      
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               csrfToken:
 *                 type: string  
 *     responses:
 *           200:
 *            description: สำเร็จ
 *           401:
 *            description: ไม่สำเร็จ
 *           500:
 *            description: ไม่สำเร็จ
 * 
 */



export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        try {

          const { email, password } = credentials
          const res = await fetch(process.env.NEXT_PUBLIC_serverURL + "/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
          })
          const data = await res.json()
          if (data.error) {
            throw new Error(data.error)
          }
          if (data.user) {
             console.log(data.user)
            return data.user
          }

        
        } catch (error) {
          console.log(error)
          throw new Error(error.message);
        }
       
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
   
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/'
  },
  callbacks: {
    jwt: async ({ token, user }) => {
    
      
      return {...token,...user}
    },
    session: async ({ session, token }) => {
      session.user = token
      return session
    }
  },
  async signIn({ user, account, profile }) {
   if(user) return true
    return false;
    
  
  }
  
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

