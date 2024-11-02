'use server'
import Navbar from '../components/Navbar'
import { redirect } from 'next/navigation'
import { toast, ToastContainer,Bounce } from 'react-toastify'
import {SquarePen,Trash2 } from 'lucide-react'
import Link from "next/link";
import { getServerSession } from 'next-auth'
import EditMedia from '../components/EditMedia'
import "react-toastify/dist/ReactToastify.css";
import { GetMediaData } from '../components/action/MediaAction'

async function getMedia() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_serverURL}/api/media`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      return data;
    }

  } catch (error) {
    console.log(error);
  }
}

export default async function Media() {
 const session = await getServerSession()
  // if(!session) redirect("/")
  

    const media = await GetMediaData()

  return (
    <>
    <Navbar/>
    <main className='max-w-7xl mx-auto pt-10 px-6'>
    <h1 className='text-2xl text-DB font-semibold text-center dark:text-white'>จัดการสื่อเนื้อหาความรู้</h1>
    
      
    <div className='flex'>
   <EditMedia initialMedia ={media.data} />
    </div>

    </main>
    
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
    </>
  )
}
