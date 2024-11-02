"use client";
import Navbar from "@/app/components/Navbar";
import { useUserContext } from "../../context/UsersContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function AllUsers() {
  const { users, setUsers } = useUserContext();
  const [search, setSearch] = useState("");
  const [stress, setStress] = useState(false);
  const [depression, setDepression] = useState(false);
  const [suicide, setSuicide] = useState(false);
  const [follow, setFollow] = useState(false);
  const [highRisk, setHighRisk] = useState(false);
  const [mayBeRisk, setMayBeRisk] = useState("all");
  const [realRisk, setRealRisk] = useState("all");
  const [userPreQuiz, setUserPreQuiz] = useState(false);
  const [userPostQuiz, setUserPostQuiz] = useState(false);
  const [userUnCompleteQuiz, setUserUnCompleteQuiz] = useState(false);
  const router = useRouter();

  const usersReduce = users.reduce((acc, item) => {
    let user = acc.find((user) => user.id === item.id);
    if (!user) {
      user = {
        ...item,
        preQuiz: item.preRq3 > 0 && item.preRq20 > 0 ? true : false,
        postQuiz: item.postRq3 > 0 && item.postRq20 > 0 ? true : false,
        quizComplete:
          item.preRq20 && item.preRq3 && item.postRq20 && item.postRq3 > 0
            ? true
            : false,
        mayBeRisk:
          item.preRq20 || item.preRq3 > 0
            ? (item.preRq20 < 55 && item.preRq20 > 0) ||
              (item.preRq3 <= 4 && item.preRq3 > 0)
              ? "high"
              : (item.preRq20 <= 69 && item.preRq20 > 55) ||
                (item.preRq3 <= 6 && item.preRq3 > 0)
              ? "medium"
              : "low"
            : null,
        realRisk:
          item.postRq20 || item.postRq3 > 0
            ? (item.postRq20 < 55 && item.postRq20 > 0) ||
              (item.postRq3 <= 4 && item.postRq3 > 0)
              ? "high"
              : (item.postRq20 <= 69 && item.postRq20 > 55) ||
                (item.postRq3 <= 6 && item.postRq3 > 0)
              ? "medium"
              : "low"
            : null,
        changeRisk:
          item.preRq20 && item.preRq3 && item.postRq20 && item.postRq3 > 0
            ? item.postRq3 > item.preRq3 && item.postRq20 > item.preRq20
              ? "ดีขึ้นมาก"
              : item.postRq3 > item.preRq3 || item.postRq20 > item.preRq20
              ? "ดีขึ้น"
              : "แย่ลง"
            : null,
      };
      acc.push(user);
    }

    return acc;
  }, []);
  console.log(usersReduce);

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
      toast.error("เกิดข้อผิดพลาด");
      console.log(error);
    }
  };

  const handleNavigate = (user) => {
    if (
      user.preRq20 === 0 &&
      user.preRq3 === 0 &&
      user.postRq20 === 0 &&
      user.postRq3 === 0
    ) {
      toast.error("ไม่สามารถดูผลได้ เนื่องจากไม่มีข้อมูลการประเมิน");
      return;
    }
    router.push(`/resultuser/${user.id}`);
  };

  return (
    <>
      {/* <Navbar /> */}
      <main className="max-w-7xl mx-auto pt-10 px-6 flex flex-col items-center p-4">
        <h1 className=" text-3xl font-semibold text-center text-DB mb-2">
          ผู้ใช้งานทั้งหมด
        </h1>
        <div className="flex flex-row w-full h-auto">
          <div className="w-1/4 h-[750px] bg-gradient-to-br from-DB via-B  to-LB rounded-md shadow-md p-6">
            {/* <button className="btn bg-white w-full text-blue-500 text-lg" onClick={()=>{
          document.getElementById("newProfileModal").showModal()
        }}>สร้างบัญชีใหม่</button> */}
            <h1 className="text-lg text-white my-2">ค้นหาผู้ใช้</h1>
            <input
              type="text"
              className="w-full border-2 border-white rounded-lg p-2"
              placeholder="ค้นหาผู้ใช้"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="mt-4 space-y-4">
              <h1 className="text-lg text-white">ผู้มีความเสี่ยง</h1>
              <select
                className="select select-bordered w-full "
                onChange={(e) => setRealRisk(e.target.value)}
                value={realRisk}
              >
                <option value="all">ทั้งหมด</option>
                <option value="low">ต่ำ</option>
                <option value="medium">ปานกลาง</option>
                <option value="high">สูง</option>
              </select>
              <h1 className="text-lg text-white">เฝ้าระวังอาจจะมีความเสี่ยง</h1>
              <select
                className="select select-bordered w-full "
                onChange={(e) => setMayBeRisk(e.target.value)}
                value={mayBeRisk}
              >
                <option value="all">ทั้งหมด</option>
                <option value="low">ต่ำ</option>
                <option value="medium">ปานกลาง</option>
                <option value="high">สูง</option>
              </select>

              <h1 className="text-lg text-white">ค้นหาตามสถานะ</h1>
              <div className="form-control rounded-md bg-white p-2">
                <label className="label cursor-pointer ">
                  <span className="label-text  text-md">สถานะติดตามแล้ว</span>
                  <input
                    type="checkbox"
                    onChange={() => setFollow(!follow)}
                    className="checkbox bg-white"
                  />
                </label>
              </div>
              <h1 className="text-lg text-white">ค้นหาตามแบบประเมิน</h1>
              <div className="form-control rounded-md bg-white p-2">
                <label className="label cursor-pointer">
                  <span className="label-text  text-md">
                    ทำแบบประเมินก่อนเสร็จแล้ว
                  </span>
                  <input
                    type="checkbox"
                    onChange={() => setUserPreQuiz(!userPreQuiz)}
                    className="checkbox bg-white"
                  />
                </label>
              </div>
              <div className="form-control rounded-md bg-white p-2">
                <label className="label cursor-pointer">
                  <span className="label-text  text-md">
                    ทำแบบประเมินหลังเสร็จแล้ว
                  </span>
                  <input
                    type="checkbox"
                    onChange={() => setUserPostQuiz(!userPostQuiz)}
                    className="checkbox bg-white"
                  />
                </label>
              </div>
              <div className="form-control rounded-md bg-white p-2">
                <label className="label cursor-pointer">
                  <span className="label-text  text-md">
                    ทำแบบประเมินยังไม่ครบ
                  </span>
                  <input
                    type="checkbox"
                    onChange={() => setUserUnCompleteQuiz(!userUnCompleteQuiz)}
                    className="checkbox bg-white"
                  />
                </label>
              </div>
            </div>
            {/* Dropdown more details */}
            <div className="flex items-end justify-end">
              <div className=" dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-circle btn-ghost btn-xs text-info"
                >
                  <svg
                    color="white"
                    tabIndex={0}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div
                  tabIndex={0}
                  className="card compact dropdown-content bg-base-100 rounded-box z-[1] w-64 shadow"
                >
                  <div tabIndex={0} className="card-body">
                    <h2 className="card-title">คำอธิบาย</h2>
                    <p>
                      <strong className="font-semibold">ผู้มีความเสี่ยง</strong>{" "}
                      คือผู้ที่ทำแบบทดก่อนและหลังกิจกรรมเสร็จแล้วและคะแนนถูกประเมินมาตามเกณฑ์ที่กำหนดไว้
                      <br />
                      <strong className="font-semibold">
                        เฝ้าระวังอาจมีความเสี่ยง
                      </strong>{" "}
                      คือผู้ที่ทำแบบทดสอบก่อนกิจกรรมเสร็จแล้วและคะแนนถูกประเมินมาตามเกณฑ์ที่กำหนดไว้
                      และบ่งบอกถึงความเสี่ยงที่คาดว่าจะตามมา
                      <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/4 ml-6 h-screen overflow-y-scroll no-scrollbar ">
            {usersReduce.length > 0 &&
              usersReduce
                .filter((user) => {
                  if (search == "") {
                    return true;
                  } else if (user.name.includes(search)) {
                    return user;
                  }
                })
                .filter((user) => {
                  if (!follow && !highRisk) {
                    return true;
                  } else if (follow && highRisk) {
                    return true;
                  } else if (follow) {
                    return user.status === "follow";
                  } else if (highRisk) {
                    return user.status === "unfollow";
                  }
                })
                .filter((user) => {
                  if (mayBeRisk === "all") {
                    return true;
                  } else if (mayBeRisk === "low") {
                    return user.mayBeRisk === "low" && !user.postQuiz;
                  } else if (mayBeRisk === "medium") {
                    return user.mayBeRisk === "medium" && !user.postQuiz;
                  } else if (mayBeRisk === "high") {
                    return user.mayBeRisk === "high" && !user.postQuiz;
                  }
                })
                .filter((user) => {
                  if (realRisk === "all") {
                    return true;
                  } else if (realRisk === "low") {
                    return user.realRisk === "low";
                  } else if (realRisk === "medium") {
                    return user.realRisk === "medium";
                  } else if (realRisk === "high") {
                    return user.realRisk === "high";
                  }
                })
                .filter((user) => {
                  if (!userPreQuiz && !userPostQuiz && !userUnCompleteQuiz) {
                    return true;
                  } else if (
                    userPreQuiz &&
                    userPostQuiz &&
                    userUnCompleteQuiz
                  ) {
                    return true;
                  } else if (userPreQuiz && userPostQuiz) {
                    return user.preQuiz === true && user.postQuiz === true;
                  } else if (userPreQuiz) {
                    return user.preQuiz === true;
                  } else if (userPostQuiz) {
                    return user.postQuiz === true;
                  } else if (userUnCompleteQuiz) {
                    return user.quizComplete === false;
                  }
                })
                .map((user) => (
                  <div
                    key={user.id}
                    className={` flex flex-row w-full items-center border-2  ${
                      ((user.preQuiz && !user.postQuiz) ||
                        (!user.preQuiz &&
                          !user.postQuiz &&
                          user.mayBeRisk !== null)) &&
                      (user.mayBeRisk === "high"
                        ? "bg-red-300"
                        : user.mayBeRisk === "medium"
                        ? "bg-yellow-100"
                        : "bg-green-200")
                    } ${
                      user.preQuiz &&
                      user.postQuiz &&
                      (user.realRisk === "high"
                        ? "bg-red-300"
                        : user.realRisk === "medium"
                        ? "bg-yellow-100"
                        : "bg-green-200")
                    } shadow-lg rounded-2xl my-4 h-28 max-sm:flex-col max-sm:h-1/2 max-sm:items-start`}
                  >
                    <div className="flex w-1/4 p-12 max-sm:p-8 ">
                      <img
                        src={user.image}
                        className="w-14 h-14 border-2  rounded-full"
                      />
                      <div className="flex flex-col ml-4">
                        <h1 className="text-xl">{user.name}</h1>
                        <h1 className=" w-24 truncate">{user.email}</h1>
                      </div>
                    </div>
                    <div className="flex  flex-wrap flex-col w-1/4 p-4 space-y-2">
                      {user.postQuiz && (
                        // ${ user.preQuiz && user.postQuiz && (user.realRisk === "high" ? "bg-red-300": user.realRisk === "medium" ? "bg-yellow-100" : "bg-green-200")}
                        <>
                          {user.realRisk === "high" && (
                            <span className={`badge border-2  p-2 `}>
                              • ผู้มีความเสี่ยงสูง
                            </span>
                          )}
                          {user.realRisk === "medium" && (
                            <span className="badge border-2  p-2 ">
                              • ผู้มีความเสี่ยงปานกลาง
                            </span>
                          )}
                          {user.realRisk === "low" && (
                            <span className="badge border-2  p-2 ">
                              • ผู้มีความเสี่ยงต่ํา
                            </span>
                          )}
                        </>
                      )}
                      {!user.postQuiz && (
                        <>
                          {user.mayBeRisk === "high" && (
                            <span className="badge border-2  p-2 ">
                              • อาจจะมีความเสี่ยงสูง
                            </span>
                          )}
                          {user.mayBeRisk === "medium" && (
                            <span className="badge border-2  p-2 ">
                              • อาจจะมีความเสี่ยงปานกลาง
                            </span>
                          )}
                          {user.mayBeRisk === "low" && (
                            <span className="badge border-2  p-2 ">
                              • อาจจะมีความเสี่ยงต่ํา
                            </span>
                          )}
                        </>
                      )}
                      {user.preRq20 === 0 &&
                        user.preRq3 === 0 &&
                        user.postRq3 === 0 &&
                        user.postRq20 === 0 && (
                          <span className="badge border-2  p-2 ">
                            ยังไม่ได้ประเมิน
                          </span>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4 w-1/2 p-10 max-sm:w-full max-sm:-mt-6">
                      <button
                        onClick={() => handleNavigate(user)}
                        className="btn border-2 border-neutral-300 w-2/6 max-sm:w-1/2"
                      >
                        ผลลัพธ์แบบทดสอบ
                      </button>
                      <button
                        className={`btn w-2/6 max-sm:w-1/2 ${
                          user.status === "follow"
                            ? "btn-success text-white"
                            : "btn text-black"
                        }`}
                        disabled={user.rq20 === 0 && user.rq3 === 0}
                        onClick={() => handleUpdateStatus(user.id)}
                      >
                        {user.status === "follow" ? "ติดตามแล้ว" : "ติดตาม"}
                      </button>
                    </div>
                  </div>
                ))}
          </div>
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
      </main>
    </>
  );
}
