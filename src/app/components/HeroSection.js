import React from 'react'
import { useParallax } from 'react-scroll-parallax'
import { motion } from 'framer-motion'


const container = (delay,x) => ({
  hidden: { x: x, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: delay,
    },
  },
});


export default function HeroSection() {
  
  return (
    <>
    <div className="flex flex-col items-center mt-6 ">
     
    <motion.h1  variants={container(0.5,-100)} initial="hidden" animate="visible" className="text-4xl sm:text-6xl lg:text-8xl text-center tracking-wide ">
        Happy Mind 
        <span className='bg-gradient-to-r from-DB to-LB text-transparent bg-clip-text'>{" "}Mental Health </span>
    </motion.h1>
    <motion.p  variants={container(1,-100)} initial="hidden" animate="visible" className='mt-10 text-lg text-center text-neutral-500 max-w-4xl'>Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act, and helps determine how we handle stress, relate to others, and make choices.</motion.p>
  <motion.img variants={container(1,100)} initial="hidden" animate="visible" src='images/slide/MH6.png' className="rounded-2xl max-w-5xl border-4 mt-20 " />
    
   </div>
   
    
    
    </>
  )
}
