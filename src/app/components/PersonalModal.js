"use client";
import React from "react";

export default function PersonalModal({ data }) {
  return (
    <dialog id="personalModal" className="modal ">
      <div className="modal-box  h-auto ">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg p-4 text-center">
          ข้อมูลส่วนบุคคลจากแบบสอบถาม
        </h3>
        
        <div className="flex flex-col space-y-3">
          <div className="flex">
            <h1>
              <span className="font-bold">เพศ : </span>
              {data.gender}
            </h1>
          </div>
          <hr />
          <div className="flex">
            <h1>
              <span className="font-bold">อายุ : </span>
              {data.age}
            </h1>
          </div>
          <hr />
          <div className="flex">
            <h1>
              <span className="font-bold">ชั้นปีที่กำลังศึกษา : </span>
              {data.education}
            </h1>
          </div>
          <hr />
          <div className="flex">
            <h1>
              <span className="font-bold">สำนักวิชา : </span>
              {data.faculty}
            </h1>
          </div>
          <hr />
          <div className="flex">
            <h1>
              <span className="font-bold">สาขา : </span>
              {data.major}
            </h1>
          </div>
          <hr />
          <div className="flex">
            <h1>
              <span className="font-bold">ศาสนา : </span>
              {data.religion}
            </h1>
          </div>
          <hr />
          <div className="flex flex-col space-y-2">
            <h1>
              <span className="font-bold">โรคประจําตัว : </span>
              {data.disease}
            </h1>
            {data.disease ==="มี" && (
                <>
                {data.physical_health &&(
                    <h1>
                    <span className="font-bold">ปัญหาสุขภาพทางกายคือ : </span>
                    {data.physical_health}
                  </h1>
                )}
                {data.mental_health &&(
                    <h1>
                    <span className="font-bold">ปัญหาสุขภาพทางจิตคือ : </span>
                    {data.mental_health}
                  </h1>
                )}
                </>
            )}
           
          </div>
          <hr />
          <div className="flex  flex-col space-y-2">
            <h1>
              <span className="font-bold">บุคคลใกล้ชิดมีปัญหาทางสุขภาพจิต : </span>
              {data.nearby}
            </h1>
            {data.nearby ==="มี" && (
                <>
                {data.nearby_relation &&(
                    <h1>
                    <span className="font-bold">มีความสัมพันธ์กับท่านเป็น : </span>
                    {data.nearby_relation}
                  </h1>
                )}
                
                </>
            )}
          </div>
          <hr />
        </div>
      </div>
    </dialog>
  );
}
