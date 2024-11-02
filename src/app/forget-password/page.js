'use client'
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MailAction } from "../components/action/MailAction";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
  const router = useRouter();

    const handleResetPassword = async (e)=>{
        e.preventDefault();
       const result = await MailAction({email})
       if(result.message === "User not found"){
           toast.error("ไม่พบอีเมลนี้ในระบบ");
       }else if(result.message === "Email sent"){
           toast.success("ส่งอีเมลสําเร็จกรุณาตรวจสอบอีเมล");
       }else{
           toast.error("เกิดข้อผิดพลาด")
       }
       
        
    }


  return (
    <div className="w-screen h-screen flex items-center justify-center bg-SLB to-white">
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
    <div className="flex  justify-around items-center  w-1/2 h-3/4 bg-white  border shadow-xl p-10 rounded-2xl">
      <div className="h-full ">
        <img src="/images/logo/smile-logo-bg-blue.png" width={400} />
        <h1 className="text-4xl sm:text-6xl lg:text-6xl  text-center tracking-wide ">
          Happy{" "}
          <span className="bg-gradient-to-r from-DB to-LB text-transparent bg-clip-text">
            Mind
          </span>
        </h1>
      </div>
      <div className="lg:w-2/5">
        <h3 className="text-4xl text-center font-semibold mb-8">รีเซ็ตรหัสผ่าน</h3>
        <hr className="my-3 border-2 border-DB rounded-lg w-full" />
        <h1 className="text-center m-4">
          กรุณากรอกอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน
        </h1>
        <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
         
          <label className="input input-bordered flex items-center gap-2">
          <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
             
            <input
              type="email"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-DB to-LB p-2 my-2 rounded-md text-white text-xl"
          >
            ส่งอีเมลล์
          </button>
        </form>
        <div className="flex flex-col items-center space-y-2 justify-center m-2">
          {/* <span className="">Don't have an account?<Link href="/register" className="text-[#F26522] underline ml-2 ">Signup</Link></span> */}
          
          <Link href={'/'}>
           กลับหน้าหลัก
          </Link>
        </div>
        {/* <div className="flex items-center space-x-1 m-2 ">
          <hr className=" border-2 border-[#F26522] rounded-lg w-full"></hr>
          <span className="text-2xl text-[#F26522] font-semibold">Or</span>
          <hr className="  border-2 border-[#F26522] rounded-lg w-1/2" />
        </div> */}
        <div className="flex justify-center space-x-4">
        
        {/* <div className="w-[250px] bg-blue-400 h-16  rounded-lg flex items-center justify-start cursor-pointer" onClick={handleGoogleSignIn}>
        <div className="bg-white h-12 w-12 rounded-lg flex items-center justify-center ml-2">
          <FcGoogle color="white" size={40} />
        </div>
          <h1 className="text-white ml-2" >Sign in With Google</h1>
        </div> */}
        
      </div>

      </div>
    </div>
  </div>
  )
}
