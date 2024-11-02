import React from 'react'

export default function AnswerQuiz({quiz}) {
    // const answers = quiz?.answers || [];
   
    const totalOptions = 4;
  return (
    <div className='w-full flex flex-col items-center h-full overflow-y-scroll   p-4'>
        <h1 className='text-3xl text-slate-900 font-semibold '>{quiz?.name}</h1>
        <h1 className='text-xl text-slate-700 font-semibold my-2'>คะแนนรวม {quiz.total} คะแนน</h1>

        {quiz?.answers?.length > 0 && quiz?.question?.length > 0 && (
        <>
          

          
          {quiz.question.map((question, qIndex) => (
            <div key={qIndex} className='mb-4 flex flex-col items-center '>
              <h2  className='text-md m-4   text-blue-600'>{question}</h2>
              <div className={`flex flex-row items-center justify-center bg-[#C5C5C59e] ${quiz?.quizId === 6|| quiz?.quizId===7 ? 'w-80' : 'w-full'} h-24 rounded-2xl`}>
              {[...Array(quiz?.quizId === 6|| quiz?.quizId===7 ? 5 : 10)].map((_, oIndex) => {
                  
                  const isSelected = quiz.answers[qIndex] === oIndex+1;
                  return (
                    <>
                    <div className='flex flex-col items-center'>
                    <h1 className='text-black'>{oIndex  +1 }</h1>
                    <div
                      key={oIndex}
                      className={`${quiz.quizId === 6 || quiz.quizId === 7 ? (oIndex === 0 || oIndex === 4 ? 'w-10 h-10' : 'w-8 h-8') : (oIndex === 0 || oIndex === 9 ? 'w-10 h-10' : 'w-8 h-8')} rounded-full m-2 ${
                        isSelected ? 'bg-blue-500' : 'bg-white'
                      } border-2 border-gray-300`}
                    />
                    </div>
                    
                    </>
                   
                  );
                })}
              </div>
             

              
            </div>
          ))}
          
        </>
      )}
       

    </div>
  )
}
