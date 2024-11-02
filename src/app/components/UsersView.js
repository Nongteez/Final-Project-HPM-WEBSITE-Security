import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "../context/UsersContext";

export default function UsersView() {
  const { users, setUsers, fetchUsers, fetchUserQuiz } = useUserContext();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  
  //ในส่วนของ ใส่รหัสผ่าน
  const [isBlurred, setIsBlurred] = useState(true);
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const usersReduce = users.reduce((acc, item) => {
    let user = acc.find((user) => user.id === item.id);
    if (!user) {
      user = {
        ...item,
        preQuiz:item.preRq3>0 && item.preRq20>0 ? true:false,
        postQuiz:item.postRq3>0 && item.postRq20>0 ? true:false,
        mayBeRisk: item.preRq20 || item.preRq3  > 0 ? item.preRq20 < 55 && item.preRq20 > 0 || item.preRq3 <= 4 && item.preRq3 > 0 ?  "high" : item.preRq20 <= 69 && item.preRq20 > 55 || item.preRq3  <=6 && item.preRq3 > 0 ? "medium" : "low" :null,
        realRisk: item.postRq20 || item.postRq3 > 0 ? item.postRq20 < 55 && item.postRq20 > 0 || item.postRq3 <= 4 && item.postRq3 > 0 ?  "high" : item.postRq20 <= 69 && item.postRq20 > 55 || item.postRq3  <=6 && item.postRq3 > 0 ? "medium" : "low" :null,
        changeRisk: item.preRq20 && item.preRq3 && item.postRq20 && item.postRq3 > 0 ?  item.postRq3 > item.preRq3  && item.postRq20 > item.preRq20 ? "ดีขึ้นมาก" : item.postRq3 > item.preRq3  || item.postRq20 > item.preRq20 ? "ดีขึ้น" : "แย่ลง" : null,
      };
      acc.push(user);
    }
    
    return acc;
  },[])

  useEffect(() => {
    if(session){
      Promise.all([fetchUsers(),fetchUserQuiz()])
    }
   
    


    
  },[]);


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
            user.id === id ? {...user,status: user.status === "follow" ? "unfollow" : "follow",}: user
          )
        );
        toast.success("ติดตามมีความผู้เสี่ยงแล้ว");
      } else if (data.message === "unfollow") {
        setUsers(
          users.map((user) =>
            user.id === id ? {...user,status: user.status === "unfollow" ? "follow" : "unfollow",}: user
          )
        );
        toast.error("ยกเลิกติดตามแล้ว");
      }else if(data.message === "fail"){
        toast.error("ไม่สามารถเปลี่ยนสถานะได้ เนื่องจากไม่มีข้อมูลการประเมิน")
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
    if(user.preRq20===0&&user.preRq3===0&&user.postRq20===0&&user.postRq3===0) {
      toast.error("ไม่สามารถดูผลได้ เนื่องจากไม่มีข้อมูลการประเมิน")
      return;
    }
    router.push(`/resultuser/${user.id}`);
  };


  const handlePasswordSubmit = () => {
    if (password === process.env.NEXT_PUBLIC_USER_VIEW_PASSWORD) {
      setIsBlurred(false);
      setIsPasswordCorrect(true);
    } else {
      toast.error("รหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleViewAll = () => {
    if (isPasswordCorrect) {
      router.push('/homepage/allusers');
    } else {
      toast.error("กรุณาใส่รหัสผ่านให้ถูกต้อง");
    }
  };


  return (
    <div>
    <div className="flex flex-col h-[300px]">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl">ผู้ใช้งาน</h1>
        <div className="flex items-center">
          <button onClick={handleViewAll} className="text-2xl text-blue-500">
            ดูทั้งหมด
          </button>
          <span>
            <ChevronRight size={30} />
          </span>
        </div>
      </div>

 {/* ส่วนของการกรอกรหัสผ่าน */}
        {isBlurred && (
          <div className="flex justify-center items-center w-full mt-4 ">
            <input
              type="password"
              placeholder="ใส่รหัสผ่านเพื่อดูข้อมูล"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg"
            />
            <button onClick={handlePasswordSubmit} className="btn ml-4">
              ยืนยัน
            </button>
          </div>
        )}

         <div className={`flex flex-wrap ${isBlurred ? "filter blur-lg" : ""}`}>
          {
            usersReduce.length > 0 &&
            usersReduce.sort((a, b) => (a.status === "follow" ? -1 : 1)) .slice(0,4).map((user) => (
              <div
                className={`flex flex-col shadow-2xl  rounded-2xl  w-60 h-60 m-8 p-2 relative border-2
                  ${ ((user.preQuiz && !user.postQuiz) || (!user.preQuiz && !user.postQuiz) && (user.mayBeRisk !== null)) && (user.mayBeRisk === "high" ? "bg-red-300": user.mayBeRisk === "medium" ? "bg-yellow-100" : "bg-green-200")} ${ user.preQuiz && user.postQuiz && (user.realRisk === "high" ? "bg-red-300": user.realRisk === "medium" ? "bg-yellow-100" : "bg-green-200")}`}
                key={user.id}
              >
                

                <img src={user.image} className=" absolute -top-8 left-[78px] rounded-full w-20 h-20 border-2 " />
                
                {user.postQuiz &&  (
                <>
               { user.realRisk === "high"  && <span className="absolute top-8 right-2  badge  border border-neutral-300">ผู้มีความเสี่ยงสูง</span>}
               { user.realRisk === "medium"  && <span className="absolute top-8 right-2  badge  border border-neutral-300">ผู้มีความเสี่ยงปานกลาง</span>}
               { user.realRisk === "low"  && <span className="absolute top-8 right-2  badge  border border-neutral-300">ผู้มีความเสี่ยงต่ํา</span>}
                </>
                
              )}
              {!user.postQuiz &&  (
                <>
                 {user.mayBeRisk === "high"  && (<span className="absolute top-8 right-2  badge  border border-neutral-300">อาจจะมีความเสี่ยงสูง</span>)}
              {user.mayBeRisk === "medium"  && (<span className="absolute top-8 right-2  badge  border border-neutral-300">อาจจะมีความเสี่ยงปานกลาง</span>)}
              {user.mayBeRisk === "low"  && (<span className="absolute top-8 right-2  badge  border border-neutral-300 ">อาจจะมีความเสี่ยงต่ํา</span>)}    
                </>
              )}               
               {user.preRq20 === 0 && user.preRq3===0 && user.postRq3===0 && user.postRq20===0 && <div className="absolute top-8 right-2  badge  border border-neutral-300">ยังไม่ได้ประเมิน</div>}
                
                <div className="flex flex-col items-center w-full mt-12">
                  <h1 className="text-lg">{user.name}</h1>
                  <h1>{user.email}</h1>
                </div>
                <div className="flex flex-col items-center w-full space-y-2 mt-2 p-2">
                  <button
                    onClick={() => handleNavigate(user)}
                    className="btn border-2 border-neutral-300 w-full"
                    disabled={isBlurred ? true :false}

                  >
                    ผลลัพธ์แบบทดสอบ
                  </button>
                  <button
                    className={`btn w-full ${
                      user.status === "follow"
                        ? "btn-success text-white"
                        : "btn text-black"
                    }`}
                    onClick={() => handleUpdateStatus(user.id)}
                    disabled={isBlurred ? true :false}

                  >
                    {user.status === "follow" ? "ติดตามแล้ว" : "ติดตาม"}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <ToastContainer
        position="top-center"
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
    </div>
  );
}
