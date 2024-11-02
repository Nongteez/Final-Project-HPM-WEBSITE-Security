"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import ThumbnailQuiz from "@/app/components/ThumbnailQuiz";
import AnswerQuiz from "@/app/components/AnswerQuiz";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "@/app/context/UsersContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GraphModal from "@/app/components/GraphModal";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";
import PersonalModal from "@/app/components/PersonalModal";

export default function ResultUser({ params }) {
  const { id } = params;
  const { data: session } = useSession();
  // if (!session) redirect("/");
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState([]);
  const { users, setUsers, allQuiz, fetchUserQuiz } = useUserContext();
  const user = users.find((user) => user.id === Number(id));
  const usersQuiz = allQuiz.filter((quiz) => quiz.userId === Number(id));
  const userId = id;
  const [personalData , setPersonalData] = useState({});

  const getPersonalData = async () => {
    const response = await fetch(`/api/user-data/${userId}`);
    const data = await response.json();
    if(response.ok){
      
      setPersonalData(data[0])
    }
  };
  useEffect(()=>{
    getPersonalData()
  },[user])

  // const fetchUsersQuizAndUserScoreView = async () => {
  //     const response = await fetch(`/api/userquizView/${id}`)
  //     const data = await response.json()
  //     setUsersQuiz(data)
  //     const response2 = await fetch(`/api/userscoreView/${id}`)
  //     const data2 = await response2.json()
  //     console.log(data2)
  //     setUser(data2)

  // }

  const handleQuizSelected = (quiz) => {
    const selectQuiz = quiz;
    setSelectedQuiz(selectQuiz);
  };

  const handleUpdateStatus = async (id) => {
    try {
      const response = await fetch(`/api/updateuser/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.message === "following") {
        setUsers(
          users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  status: user.status === "follow" ? "unfollow" : "follow",
                }
              : user
          )
        );
        toast.success("ติดตามมีความผู้เสี่ยงแล้ว");
      } else if (data.message === "unfollow") {
        setUsers(
          users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  status: user.status === "unfollow" ? "follow" : "unfollow",
                }
              : user
          )
        );
        toast.error("ยกเลิกติดตามแล้ว");
      } else if (data.message === "fail") {
        toast.error("ไม่สามารถเปลี่ยนสถานะได้ เนื่องจากไม่มีข้อมูลการประเมิน");
      }
      if (!response.ok) {
        throw Error(data.error);
      }
    } catch (error) {
      toast.error("ไม่สามารถเปลี่ยนสถานะได้");
      console.log(error);
    }
  };

  const exportExcel = (id) => {
    const Quiz = usersQuiz.find((quiz) => quiz.id === Number(id));
    const prePost = Quiz?.quizType === "PRE" ? "แบบทดสอบก่อนกิจกรรม-" : "แบบทดสอบหลังกิจกรรม-";
    const wb = XLSX.utils.book_new();
    let sheetName = "";
    const addWorksheet = (quiz) => {
      const { question, answers, name, total, pressure, encouragement, obstacle } = quiz;
      let worksheetData = [];
     
  
      if (quiz.quizId === 8) {
        const headers = ["แบบประเมิน", "คำถาม", "คะแนน"];
        const data = question.map((q, index) => [
          index === 0 ? name : " ",
          q,
          answers[index],
        ]);
        data.push([" ", " ", " "]);
        data.push(["", "คะแนนเฉลี่ย", total]); 
        worksheetData = [headers, ...data];
        sheetName = "Rq3";
      } else if (quiz.quizId === 7) {
        const headers = ["แบบประเมิน", "คำถาม", "คะแนน"];
        const data = question.map((q, index) => [
          index === 0 ? name : " ",
          q,
          answers[index],
        ]);
        data.push([" ", " ", " "]);
        data.push(["", "ด้านความทนต่อแรงกดดัน ", pressure]); 
        data.push(["", "ด้านการมีความหวังและกำลังใจ ", encouragement]); 
        data.push(["", "ด้านการต่อสู้เอาชนะอุปสรรค", obstacle]); 
        data.push(["", "คะแนนรวม", total]); 
        worksheetData = [headers, ...data];
        sheetName = "Rq20";
      } else if (quiz.quizId === 6) {
        const headers = ["แบบประเมิน", "คำถาม", "คะแนน"];
        const data = question.map((q, index) => [
          index === 0 ? name : " ",
          q,
          answers[index],
        ]);
        data.push([" ", " ", " "]);
        data.push(["", "คะแนนเฉลี่ย", total]); 
        worksheetData = [headers, ...data];
        sheetName = "MHL29";
      }
  
    
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    };
  
    
    addWorksheet(Quiz);
    XLSX.writeFile(wb, `${prePost}${sheetName}-${user.name}.xlsx`);
  };
  const exportAllExcel = () => {
  
    const wb = XLSX.utils.book_new();
  
   
    const addWorksheet = (quiz) => {
      const { question, answers, name, total, pressure, encouragement, obstacle } = quiz;
      const prePost = quiz?.quizType === "PRE" ? "แบบทดสอบก่อนกิจกรรม-" : "แบบทดสอบหลังกิจกรรม-";
      let worksheetData = [];
      let sheetName = "";
  
      if (quiz.quizId === 8) {
        const headers = ["แบบประเมิน", "คำถาม", "คะแนน"];
        const data = question.map((q, index) => [
          index === 0 ? name : " ",
          q,
          answers[index],
        ]);
        data.push([" ", " ", " "]);
        data.push(["", "คะแนนเฉลี่ย", total]); 
        worksheetData = [headers, ...data];
        sheetName = `${prePost}Rq3`;
      } else if (quiz.quizId === 7) {
        const headers = ["แบบประเมิน", "คำถาม", "คะแนน"];
        const data = question.map((q, index) => [
          index === 0 ? name : " ",
          q,
          answers[index],
        ]);
        data.push([" ", " ", " "]);
        data.push(["", "ด้านความทนต่อแรงกดดัน ", pressure]); 
        data.push(["", "ด้านการมีความหวังและกำลังใจ ", encouragement]); 
        data.push(["", "ด้านการต่อสู้เอาชนะอุปสรรค", obstacle]); 
        data.push(["", "คะแนนรวม", total]); 
        worksheetData = [headers, ...data];
        sheetName = `${prePost}Rq20`;
      } else if (quiz.quizId === 6) {
        const headers = ["แบบประเมิน", "คำถาม", "คะแนน"];
        const data = question.map((q, index) => [
          index === 0 ? name : " ",
          q,
          answers[index],
        ]);
        data.push([" ", " ", " "]);
        data.push(["", "คะแนนเฉลี่ย", total]); 
        worksheetData = [headers, ...data];
        sheetName = `${prePost}MHL29`;
      }
  
     
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    };
  
    
    usersQuiz.sort((a, b) => (a.quizType < b.quizType ? 1 : -1)).forEach((quiz) => addWorksheet(quiz));
  
   
    XLSX.writeFile(wb, `แบบทดสอบทั้งหมด-${user.name}.xlsx`);
  };
  

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto  px-6 flex flex-row max-sm:flex-col  shadow-sm   lg:h-[calc(100vh-90px)]">
        <div className="w-2/5 max-sm:w-full  bg-white h-full mb-4 overflow-y-scroll no-scrollbar">
          <div className="flex flex-col items-center  w-full">
            <div className="flex flex-col items-center h-80 pt-8 mb-6 w-full">
              <div className="flex flex-col items-center w-full">
                <img src={user?.image} className="w-20 h-20 rounded-full" />
                <h1 className="text-md mt-2">{user?.name}</h1>
                <h1 className="text-md mt-2">{user?.email}</h1>
                <div className="space-y-2 flex flex-col items-center w-1/2">
                <button
                    className="btn border-2 border-neutral-300 w-full"
                    onClick={() =>
                      document.getElementById("personalModal").showModal()
                    }
                  >
                    ข้อมูลส่วนบุคคล
                  </button>
                  <button
                    className="btn border-2 border-neutral-300 w-full"
                    onClick={() =>
                      document.getElementById("graphModal").showModal()
                    }
                  >
                    เปรียบเทียบแบบทดสอบ
                  </button>
                  <button
                    className={`btn w-full ${
                      user?.status === "follow"
                        ? "btn-success text-white"
                        : "btn-outline text-black"
                    }`}
                    onClick={() => handleUpdateStatus(user?.id)}
                  >
                    {user?.status === "follow" ? "ติดตามแล้ว" : "ติดตาม"}
                  </button>
                 
                </div>
               
              </div>
            </div>

            <ThumbnailQuiz
              quiz={usersQuiz}
              onQuizSelected={handleQuizSelected}
             exportExcel={exportExcel}
            />
          </div>
          <div className="flex flex-col items-center">
          <button
                    className={`btn border-2 border-neutral-300 w-1/2 mt-2 bg-green-600`}
                    onClick={() => exportAllExcel() }
                  ><FaFileExcel size={20} color="#fff" className="mr-2" />
                    ดาวน์โหลดทั้งหมด
                  </button>
          </div>
         
        </div>
        <div
          className={`w-3/5 h-full max-sm:w-full shadow-lg ${
            selectedQuiz.length === 0 ? " bg-white" : "bg-white"
          } `}
        >
          {selectedQuiz.length === 0 ? (
            <div className="flex justify-center w-full h-full items-center">
              <h1 className="text-3xl font-bold text-center">
                กรุณาเลือกแบบทดสอบ
              </h1>
            </div>
          ) : (
            <AnswerQuiz quiz={selectedQuiz} />
          )}
        </div>

        <GraphModal userQuiz={usersQuiz} />
        <PersonalModal data={personalData} />
      </div>

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
  );
}
