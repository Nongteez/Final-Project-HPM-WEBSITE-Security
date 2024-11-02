'use client'
import React, { useEffect, useState } from "react";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdatePassword } from "@/app/components/action/UpdatePasswordAction";
import { VerifyToken } from "../../../../lib/auth";


export default function ResetPasswordPage({params}) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [exp ,setExp] = useState(false);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    
    useEffect(()=>{
        const token = params.token
       const data = VerifyToken(token)
       if(!data){
           setLoading(false)
           setExp(true)
       }else{
           setLoading(false)
           setExp(false)
       }
    },[params,router])
  
      const handleResetPassword = async (e)=>{
          e.preventDefault();
          if(password !== confirmPassword){
              toast.error("รหัสผ่านไม่ตรงกัน");
              return;
          }
         const data = await UpdatePassword({password, token: params.token})
         if(data.message === "Password updated successfully"){
             toast.success("เปลี่ยนรหัสผ่านสําเร็จ")
             setSuccess(true)

         }else{
            toast.error("ไม่สามารถเปลี่ยนรหัสผ่านได้")
         }
          
      }
  
  
    return (
      <div className="w-screen h-screen flex items-center justify-center ">
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
      {!success ? (
        loading ? (
            <div className="flex flex-col justify-center items-center  w-1/2 h-3/4  border shadow-xl p-10 rounded-2xl max-sm:w-full max-sm:h-full">
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
          ) : (
            exp ? (
                <div className="flex flex-col justify-center items-center  w-1/2 h-3/4  border shadow-xl p-10 rounded-2xl  max-sm:w-full max-sm:h-full">
                  <div className="h-full   max-sm:flex-col max-sm:items-center ">
                    <img src="/images/logo/smile-logo-bg-blue.png" width={400} />
                    <h1 className="text-4xl sm:text-6xl lg:text-6xl  text-center tracking-wide ">
                      Happy{" "}
                      <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">
                        Mind
                      </span>
                    </h1>
                    <h3 className="text-4xl text-center font-semibold my-8">ลิ้งค์หมดอายุ</h3>
                  </div>
                  
                    
                  </div>
                
              ) : (
                <div className="lg:flex  lg:justify-around lg:items-center  lg:w-1/2 lg:h-3/4  border shadow-xl p-12  rounded-2xl max-sm:flex max-sm:flex-col max-sm:w-full max-sm:h-full max-sm:items-center max-sm:justify-center">
                <div className="h-full max-sm:h-1/5 max-sm:flex max-sm:items-center  max-sm:justify-center">
                  <img src="/images/logo/smile-logo-bg-blue.png" className="lg:w-[400px] max-sm:w-1/5" />
                  <h1 className="text-4xl max-sm:text-3xl sm:text-6xl lg:text-6xl  text-center tracking-wide ">
                    Happy{" "}
                    <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">
                      Mind
                    </span>
                  </h1>
                </div>
                <div className="">
                  <h3 className="text-4xl text-center font-semibold mb-8">New Password</h3>
                  <hr className="my-3 border-2 border-[#3b82f6] rounded-lg w-full" />
                  <h1 className="text-center m-4 max-sm:text-sm">
                    Enter your new password and confirm it
                  </h1>
                  <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
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
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </label>
          
                    <button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-400 p-2 my-2 rounded-md text-white font-semibold text-xl"
                    >
                      Reset Password
                    </button>
                  </form>
                 
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
              )
          )
      ):(
        <div className="flex flex-col justify-center items-center  w-1/2 h-3/4  border shadow-xl p-10 rounded-2xl  max-sm:w-full max-sm:h-full">
        <div className="h-full max-sm:flex-col max-sm:items-center ">
          <img src="/images/logo/smile-logo-bg-blue.png" width={500} />
          <h1 className="text-4xl sm:text-6xl lg:text-6xl  text-center tracking-wide ">
            Happy{" "}
            <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text">
              Mind
            </span>
          </h1>
          <h3 className="text-4xl text-center font-semibold my-8">เปลี่ยนรหัสผ่านสำเร็จสามารถเข้าสู่ระบบได้</h3>
        </div>
        
          
        </div>
      )}
      {}
     
     
    </div>
    )
  }
  