'use client'

import Navbar from "./components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeroSection from "./components/HeroSection";
import SecondSection from "./components/SecondSection ";
import CareSection from "./components/CareSection";
import Footer from "./components/Footer";




export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // if(session) router.replace("/homepage");
 
  
  return (
    <>
    
    
    
    <Navbar/>
    
    <main  className="max-w-7xl mx-auto pt-20 px-6">
    
    <HeroSection/>
    <SecondSection/>
    <CareSection/>

    <Footer/>
    </main>
    
    
    {/* fluke test commit */}
    {/* <Slide/> */}
    

    

   


   
   
  
    </>
  );
}
