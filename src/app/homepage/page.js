'use client'

import {useState,useEffect} from 'react'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from '../components/Navbar';
import Graph from "../components/Graph";
import UsersView from '../components/UsersView';
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '../context/UsersContext';
import { useRouter } from 'next/navigation';


export default function page() {
    const { data: session } = useSession();
    const {  fetchUsers, fetchUserQuiz } = useUserContext();
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter();
    console.log(session)
    // if (!session) redirect("/");

   

 

  return (
    <>
   
    {/* <Navbar/> */}
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
    <Graph/>
  
    <main  className="max-w-7xl mx-auto pt-20 px-6">
      <UsersView/>
    </main>
    
    </>
  )
}
