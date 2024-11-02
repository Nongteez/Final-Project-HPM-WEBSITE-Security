"use client";
import jwt from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VerifyToken } from "../../../../lib/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function LoginPage({params}) {
  const token = params.token
  const router = useRouter();
  const handleLogin = async () => {
    try {
    const data = VerifyToken(token)
    const email = data.email
    const password = data.password
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if(!res.ok){
        toast.error(res.error);
      }
      if (res.ok) {
        try { 
          const resSession = await fetch("/api/auth/session");
          const data = await resSession.json();
          if (data.user) {
            if (data.user.role === 1) {
              toast.success("เข้าสู่ระบบสําเร็จ");
              setTimeout(() => {
                router.replace("/homepage");
              }, 500);
            } else {
              toast.error("คุณไม่มีสิทธิ์เข้าใช้งาน");
              setTimeout(async() => {
                await signOut();
              }, 500);
              
             
            }
          }
        } catch (error) {
          toast.error("ไม่สามารถเข้าสู่ระบบได้");
          console.log(error);
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(()=>{
    handleLogin()
  },[token])
  

  
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
      <div className="lg:flex lg:flex-col  lg:justify-center lg:items-center  lg:w-1/2 lg:h-3/4 bg-white  border shadow-xl p-10 rounded-2xl max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:w-full max-sm:h-full max-md:flex max-md:flex-col max-md:justify-center">
              <div className="h-full ">
                <img src="/images/logo/smile-logo-bg-blue.png" width={400} />
                <h1 className="text-4xl sm:text-6xl lg:text-6xl  text-center tracking-wide ">
                  Happy{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">
                    Mind
                  </span>
                </h1>
              </div>
              <div className=" w-auto flex items-center justify-center">
              <span className="loading loading-dots loading-lg bg-blue-500"></span>
            </div>
           
      </div>
    </div>
  );
}


