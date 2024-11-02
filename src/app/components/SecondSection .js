import { BrainCircuit } from 'lucide-react'
import { motion } from 'framer-motion'


export default function SecondSection (){
    const MetalItems =[
        {
            id:1,
            title:'Depression',
            description: "Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest. and Depression rate 37.89 % ",
    
        },
        {
            id:2,
            title:'Stress',
            description:"Stress is a state of worry or mental tension caused by a difficult situation. and Stress rate 32.27 %",
        },
        {
            id:3,
            title:'Suicide',
            description:"Suicide is the act of intentionally causing one's own death. Mental disorders physical disorders and substance abuse. and Suicide rate 22.88 %",
        },
        {
            id:4,
            title:'Burnout',
            description:"Burnout is a state of emotional, mental, and often physical exhaustion brought on by prolonged or repeated stress. and Burnout rate 7.52 %",
        }
    ]
    return (
        <div className='mt-20'>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
                What 
                <span className="bg-gradient-to-r from-DB to-LB text-transparent bg-clip-text ">{" "}mental illnesses </span>
                are found?
                
          </h2>
          <div className="flex flex-wrap justify-center mt-10">
            <motion.div whileInView={{opacity: 1,x:0}} initial={{opacity:0,x:-100}} transition={{duration:0.5}} className="p-2 w-full lg:w-1/2">
                <img src='/images/slide/MH4.jpg' className='rounded-2xl border-4' alt="#"/>
            </motion.div>
            <div className="pt-8 w-full lg:w-1/2  ">
                {MetalItems.map((item, index) => (
                    <motion.div whileInView={{opacity: 1,x:0}} initial={{opacity:0,x:100}} transition={{duration:0.5}} key={index} className="flex mb-12">
                        <div className="text-blue-400 mx-6 bg-white shadow-md h-10 w-10 p-2 justify-center items-center rounded-full">
                            <BrainCircuit />
                        </div>
                        <div>
                            <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
                            <p className="text-md text-neutral-500 ">{item.description}</p>
                        </div>
                    </motion.div>
                  
                ))}
            </div>
          </div>
          
        </div>
    )
}