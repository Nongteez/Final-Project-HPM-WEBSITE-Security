import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
  // ตรวจสอบว่าอยู่ใน production หรือไม่
  if (process.env.NODE_ENV === 'production' && request.nextUrl.protocol === 'http:') {
    const httpsUrl = new URL(request.url)
    httpsUrl.protocol = 'https:'
    return NextResponse.redirect(httpsUrl)
  }

  // ตรวจสอบ token ของผู้ใช้
  const token = await getToken({ req: request });
  console.log("middleware")

  // ตรวจสอบการเข้าสู่ระบบสำหรับหน้าแรก
  if (request.nextUrl.pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/homepage', request.url))
    } else {
      return NextResponse.next()
    }
  }

  // ตรวจสอบ token สำหรับหน้าที่ต้องการการ authentication
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  } else {
    return NextResponse.next()
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/homepage/:path*", "/", "/result", "/edituser/:path*", "/media", "/community/:path*", "/support/:path*"],
}

/*import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const token = await getToken({ req: request });
   console.log("middleware")
   
   if(request.nextUrl.pathname === '/'){
    if(token){
      return NextResponse.redirect(new URL('/homepage', request.url))
    }else{
      return NextResponse.next()
    }
   }
  if(!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }else {
    return NextResponse.next()
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/homepage/:path*","/","/result","/edituser/:path*","/media","/community/:path*","/support/:path*"],
}*/