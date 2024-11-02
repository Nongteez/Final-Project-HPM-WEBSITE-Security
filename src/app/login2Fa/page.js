"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { emailToLogin } from "../components/action/MailAction";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!email || !password){
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return
    }
    try {
        const res =  await emailToLogin({email,password})
        if(res.message === "Email sent"){
            toast.success("กรุณาตรวจสอบอีเมลของคุณ เพื่อเข้าสู่ระบบ");
        }else if(res.message === "Error"){
            toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }else if(res.message === "User not found"){
            toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
       
        
      
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  

  
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
      <div className="lg:flex  lg:justify-around lg:items-center  lg:w-1/2 lg:h-3/4 bg-white  border shadow-xl p-10 rounded-2xl max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:w-full max-sm:h-full max-md:flex max-md:flex-col max-md:justify-center">
        <div className="h-full max-sm:hidden max-md:hidden max-lg:hidden lg:block">
          <img src="/images/logo/smile-logo-bg-blue.png" className="w-[400px] max-sm:w-[200px]" />
          <h1 className="text-4xl sm:text-6xl lg:text-6xl  text-center tracking-wide ">
            Happy{" "}
            <span className="bg-gradient-to-r from-DB to-LB text-transparent bg-clip-text">
              Mind
            </span>
          </h1>
        </div>
        <div className="lg:w-2/5">
          <h3 className="text-4xl text-center font-semibold mb-8">เข้าสู่ระบบ</h3>
          <hr className="my-3 border-2 border-DB rounded-lg w-full" />
          <h1 className="text-center m-4">
            กรุณากรอก อีเมล์ และ รหัสผ่าน
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
                autoFocus
                
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                className="grow"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-DB to-LB p-2 my-2 rounded-md text-white font-semibold text-xl shadow-lg"
            >
              เข้าสู่ระบบ
            </button>
          </form>
          <div className="flex flex-col items-center space-y-2 justify-center m-2">
            {/* <span className="">Don't have an account?<Link href="/register" className="text-[#F26522] underline ml-2 ">Signup</Link></span> */}
            <Link href="/forget-password" className="text-DB underline ml-2 ">
              ลืมรหัสผ่าน
            </Link>
            <Link href={'/'}>
             กลับหน้าหลัก
            </Link>
          </div>
          

        </div>
      </div>
    </div>
  );
}
