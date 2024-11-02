import {Dumbbell,HandHeart,Music,TentTree,Laugh} from "lucide-react"
import { motion } from "framer-motion";

export default function CareSection() {
    
 const CareMental = [
    {
      icon: <Dumbbell />,
      text: "Exercise to build immunity",
      description: "Exercise to build your own immunity is considered mental health care that should be done regularly."
    },
    {
      icon: <Music />,
      text: "Relax by listening to music",
      description: "Listening to your favorite songs is one way to take care of your mental health. This helps you feel relaxed and free from stress."
    
    },
    {
      icon: <HandHeart />,
      text: "Create inspiration for yourself",
      description: "Creating and encouraging yourself is taking care of your mental health that everyone should do. No matter how many obstacles you encounter Taking care of our mental health so as not to let our minds become depressed or depressed. It means taking care of yourself fully and encouraging yourself."

    },
    {
      icon: <Laugh />,
      text: "Release emotions",
      description: "When we hold negative things in our hearts, we can become uncomfortable and impatient with them. Therefore, the best solution is to let things happen naturally. And you shouldn't keep small things to bother you."
    },
    {
      icon: <TentTree />,
      text: "Find free time to go on vacation",
      description: "If you have free time on holiday We encourage you to get out and experience new things. This is a way to take care of your mental health by giving yourself time to decompress from work or bad events during the week."
    },
   
  ];
    return (
        <div className='mt-20'>
    <motion.h2 whileInView={{opacity: 1,x:0}} initial={{opacity:0,x:-100}} transition={{duration:0.5}} className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
            How to  
            <span className="bg-gradient-to-r from-DB to-LB text-transparent bg-clip-text ">{" "}take care </span>
            of your mental health 
            
      </motion.h2>
      <div className='flex flex-wrap mt-10 lg:mt-20'>
        {CareMental.map((feature, index) => (
          <motion.div whileInView={{opacity: 1,x:0}} initial={{opacity:0,x:100}} transition={{duration:0.5}} key={index} className='w-full sm:w-1/2 lg:w-1/3  max-sm:h-80  '>
            <div className='flex'>
                <div className='flex mx-6 h-10 w-10 p-2 bg-white shadow-md text-blue-400 justify-center items-center rounded-full'>
                    {feature.icon}
                </div>
                <div>
                    <h5 className='mt-1 mb-6 text-xl'>{feature.text}</h5>
                    <p className='text-neutral-500 text-md p-2 mb-20 h-20 text-ellipsis'>{feature.description}</p>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
      
    </div>
    )
}