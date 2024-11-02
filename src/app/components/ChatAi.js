'use client'
import React, { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useSession } from 'next-auth/react';
import { SendHorizontal } from "lucide-react";

const  Messages =[
  {
    fromSelf: true,
    message: "Hello",
    createAt: new Date()
  },
  {
    fromSelf: false,
    message: "Hi",
    createAt: new Date()
  }
]

export default function ChatAi() {
    const [answer ,setAnswer] = useState('');
    const [message, setMessage] = useState('');
  const { data: session } = useSession();
  const [dataMessage , setDataMessage] = useState(Messages);

   

    const ChatAiAnswer =  async (e)=>{
        e.preventDefault();
        try {
            setDataMessage(prev=> [...prev,{
                fromSelf: true,
                message: message,
                createAt: new Date()
            }])
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
            const prompt = ` คุณเล่นบทเป็นหมอนะ โดยผมเป็นคนที่มีสภาวะทางจิต คุณช่วยแนะนำให้ความรู้เกี่ยวกับเรื่องสุขภาพจิต ${message}`
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text =  response.text();
            setDataMessage(prev=> [...prev,{
                fromSelf: false,
                message: text,
                createAt: new Date()
            }])
            setMessage('');
        } catch (error) {
            console.log(error)
        }
    }

    function formatTime(createAt) {
      const date = new Date(createAt);
      return `${date.getHours()}:${date.getMinutes()}`;
    }
   

  return (
    <div className='w-full h-screen'>
       <>
      <div className="h-[700px] w-full p-4 overflow-y-scroll">
        {dataMessage.length > 0 &&
          dataMessage.map((message, index) => (
            <>
            {!message.fromSelf ?(
                <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src='/images/avatars/avatar1.png'
                    />
                  </div>
                </div>
               
                <div className="chat-bubble ">
               
                {message.message}
                
                 
                </div>
                <div className="chat-footer">
                    <time className="text-xs opacity-50"> {formatTime(message.createAt)} </time>
                </div>
              </div>
            ):(
                <div className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img src={session.user.image} />
                  </div>
                </div>
               
                <div className="chat-bubble ">
                 
                {message.message}
                  </div>
                <div className="chat-footer">
                    <time className="text-xs opacity-50"> {formatTime(message.createAt)}</time>
                </div>
              </div>
            )}
              
              
            
            </>
          ))}
          {dataMessage.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-4xl font-bold">No message</h1>
            </div>
          )}
      </div>

      <div className="flex items-center h-[10%]  w-full">
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-[90%]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ChatAiAnswer(e)}
        />
        <button className="btn bg-white w-[10%]">
          <SendHorizontal color="#f97316" onClick={ChatAiAnswer} />
        </button>
      </div>
    </>

    </div>
  )
}
