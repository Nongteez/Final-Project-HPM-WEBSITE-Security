'use client'
import React from 'react'
import { FileMinus } from 'lucide-react'
import { useState } from 'react'


export default function ThumbnailQuiz({quiz,onQuizSelected,exportExcel}) {
    const [selectQuiz , setSelectQuiz] = useState(null)
    const preQuizRq29 = quiz.find(quiz => quiz.quizId === 6 && quiz.quizType === "PRE")
    const preQuizRq20 = quiz.find(quiz => quiz.quizId === 7 && quiz.quizType === "PRE")
    const preQuizRq3 = quiz.find(quiz => quiz.quizId === 8 && quiz.quizType === "PRE")
    const postQuizRq29 = quiz.find(quiz => quiz.quizId === 6 && quiz.quizType === "POST")
    const postQuizRq20 = quiz.find(quiz => quiz.quizId === 7 && quiz.quizType === "POST")
    const postQuizRq3 = quiz.find(quiz => quiz.quizId === 8 && quiz.quizType === "POST")
   
  

    const handleClick = (id) => {
        setSelectQuiz(id)
    }

   

  return (
    <>
    {quiz?.length > 0 ? (
      <>
      <div className='my-2 flex flex-col w-full space-y-2 items-center justify-center'>
    <h1  className='font-semibold text-lg'>แบบประเมินก่อนกิจกรรม</h1>
    <hr className="  border-2 border-DB rounded-lg w-1/2" />
    </div>
    {/* <div className='flex flex-wrap items-center gap-2 w-10/12 p-4'> */}
      {/* {preQuizRq3 && (<span className="badge border-2 badge-lg    p-3">• พลังใจ{preQuizRq3.total >=7 ? "มาก" : preQuizRq3.total >=5 ? "กลาง" : "น้อย"}</span>)} */}
  {/* pressure แรงกดดัน encouragement  กำลังใจ obstacle อุปสรรค */}
  {/* {preQuizRq20 && (<span className='badge border-2 badge-lg   p-3'>• ความทนต่อแรงกดดัน{preQuizRq20.pressure > 34 ? "สูงกว่าปกติ" : preQuizRq20.pressure <= 34 && preQuizRq20.pressure >= 27 ? "ความทนต่อแรงกดดันปกติ" : "ความทนต่อแรงกดดันต่ำกว่าปกติ"}</span>)}
  {preQuizRq20 && (<span className='badge border-2 badge-lg    p-3'>• {preQuizRq20.encouragement > 19 ? "การมีความหวังและกำลังใจสูงกว่าปกติ" : preQuizRq20.encouragement <= 19 && preQuizRq20.encouragement >= 14 ? "การมีความหวังและกำลังใจปกติ" : "การมีความหวังและกำลังใจต่ำกว่าปกติ"}</span>)}
  {preQuizRq20 && (<span className='badge border-2 badge-lg    p-3'>• {preQuizRq20.obstacle > 18 ? "การต่อสู้เอาชนะอุปสรรคสูงกว่าปกติ" : preQuizRq20.obstacle <= 18 && preQuizRq20.obstacle >= 13 ? "การต่อสู้เอาชนะอุปสรรคปกติ" : "การต่อสู้เอาชนะอุปสรรคต่ำกว่าปกติ"}</span>)}
  {preQuizRq29 && (<span className='badge border-2 badge-lg p-3'>• {preQuizRq29.total >= 3.68 && preQuizRq29.total <=5 ? "ความรอบรู้ด้านสุภาพจิตมาก" : preQuizRq29.total <= 3.67 && preQuizRq29.total >= 2.34 ? "ความรอบรู้ด้านสุภาพจิตปกติ" : "ความรอบรู้ด้านสุภาพจิตน้อย"}</span>)} */}
    {/* </div> */}

   
     {quiz.filter((quiz)=>{
        return quiz.quizType==="PRE"
    }).map((quiz, index) => (
      
      <div key={quiz.id} className={`w-10/12 p-4 mt-4 ${selectQuiz === quiz.id ? 'bg-gradient-to-r from-DB via-B to-LB ' : "bg-white"}  rounded-2xl cursor-pointer shadow-xl `} onClick={() => {handleClick(quiz.id), onQuizSelected(quiz)}}>
        <div className='h-20 flex items-center justify-around '>
            <div className={`flex flex-col flex-wrap space-y-2 ${selectQuiz === quiz.id ? 'text-white text-lg' : 'text-black'}`}>
            <h1 className='text-md'>{quiz?.name} | {quiz.answers.length} คำถาม</h1>
            {quiz.quizId === 8 && (<span className="badge border-2  ">• {quiz.total >=7 ? "พลังใจมาก" : quiz.total >=5 ? "พลังใจปานกลาง" : "พลังใจน้อย"}</span>)}
            {quiz.quizId === 7 && (<span className="badge border-2  ">• {quiz.total >69  ? "คะแนนรวมสูงกว่าปกติ" : quiz.total >= 55 && quiz.total <= 69 ? "คะแนนรวมปกติ" : "คะแนนรวมต่ำกว่าปกติ"}</span>)}
            {quiz.quizId === 6 && (<span className="badge border-2  ">• {quiz.total >=3.68 && quiz.total < 5  ? "ความรอบรู้ด้านสุภาพจิตมาก" : quiz.total <= 3.67 && quiz.total >= 2.34 ? "ความรอบรู้ด้านสุภาพจิตปกติ" : "ความรอบรู้ด้านสุภาพจิตน้อย"}</span>)}


            </div>
            <div className=' tooltip' data-tip="ดาวน์โหลดข้อมูล" >
            <div className='rounded-full bg-gray-100 p-2 w-14 h-14 flex items-center justify-center' onClick={() => exportExcel(quiz.id)}>
            <FileMinus size={35} color={selectQuiz === quiz.id ? '#3b82f6' : '#111827'} />

            </div>
            </div>
        </div>
    </div>
    
      
        
    ))}
  <div className='my-4 flex flex-col w-full space-y-2 items-center justify-center'>
    <h1 className='font-semibold text-lg'>แบบประเมินหลังกิจกรรม</h1>
    <hr className="  border-2 border-DB rounded-lg w-1/2" />
    </div>
    <div>
      
     
    </div>
     {quiz.filter((quiz)=>{
        return quiz.quizType==="POST"
    }).map((quiz, index) => (
      
      <div key={quiz.id} className={`w-10/12 p-4 mt-4 mb-4 ${selectQuiz === quiz.id ? 'bg-gradient-to-r from-DB via-B to-LB ' : "bg-white"}  rounded-2xl cursor-pointer shadow-xl `} onClick={() => {handleClick(quiz.id), onQuizSelected(quiz)}}>
        <div className='h-20 flex items-center justify-around '>
            <div className={`flex flex-col ${selectQuiz === quiz.id ? 'text-white text-lg' : 'text-black'}`}>
            <h1 className='text-md'>{quiz?.name} | {quiz.answers.length} คำถาม</h1>
            {quiz.quizId === 8 && (<span className="badge border-2  ">• {quiz.total >=7 ? "พลังใจมาก" : quiz.total >=5 ? "พลังใจปานกลาง" : "พลังใจน้อย"}</span>)}
            {quiz.quizId === 7 && (<span className="badge border-2  ">• {quiz.total >69  ? "คะแนนรวมสูงกว่าปกติ" : quiz.total >= 55 && quiz.total <= 69 ? "คะแนนรวมปกติ" : "คะแนนรวมต่ำกว่าปกติ"}</span>)}
            {quiz.quizId === 6 && (<span className="badge border-2  ">• {quiz.total >=3.68 && quiz.total < 5  ? "ความรอบรู้ด้านสุภาพจิตมาก" : quiz.total <= 3.67 && quiz.total >= 2.34 ? "ความรอบรู้ด้านสุภาพจิตปกติ" : "ความรอบรู้ด้านสุภาพจิตน้อย"}</span>)}
            </div>
            <div className=' tooltip' data-tip="ดาวน์โหลดข้อมูล" >
            <div className='rounded-full bg-gray-100 p-2 w-14 h-14 flex items-center justify-center' onClick={() => exportExcel(quiz.id)}>
            <FileMinus size={35} color={selectQuiz === quiz.id ? '#3b82f6' : 'black'} />

            </div>
            </div>
        </div>
         
    </div>
    
      
        
    ))}
      </>
    ):(
      <div>
        ไม่มีแบบทดสอบ
      </div>
    )}
    
    </>
   
  
  )
}
