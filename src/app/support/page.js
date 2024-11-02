"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useUserContext } from "../context/UsersContext";
import ChatElement from "../components/ChatElement";
import { ToastContainer, toast, Bounce } from "react-toastify";
import DotIndicator from "../components/DotIndicator";
import "react-toastify/dist/ReactToastify.css";

export default function Support() {
  const { data: session } = useSession();
  if (!session) redirect("/");
  const [users, setUser] = useState([]);
  const [isSelected, setIsSelected] = useState(0);
  const [selectUser, setSelectUser] = useState([]);
  const [unreadMessage, setUnreadMessage] = useState([]);
  const [dot, setDot] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUnreadMessage = async () => {
    try {
      const res = await fetch("/api/chat/unread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session.user.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUnreadMessage(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    Promise.all([getUsers(), getUnreadMessage()]).then(() => {
      setLoading(false);
    })
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto h-[calc(100vh-80px)] px-6 flex  flex-wrap overflow-y-hidden">
        <div className="w-1/4 lg:h-[calc(100vh-80px)] flex flex-col bg-white  p-2 overflow-y-scroll shadow-md border no-scrollbar">
          <input
            className="p-2 rounded-md shadow-sm border-2 my-2"
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          {loading ? (
            <div className="flex justify-center items-center h-full"> <span className="loading loading-dots loading-lg text-blue-500"></span></div>
          ) :( users.length > 0 &&
            users
              .sort((a, b) => {
                const unreadA = unreadMessage.some(
                  (item) => item.sender === a.id
                );
                const unreadB = unreadMessage.some(
                  (item) => item.sender === b.id
                );
                return unreadB - unreadA;
              })
              .filter((user) => user.id !== session.user.id)
              .filter((user) =>
                user.name.includes(search)
              )
              .map((user) => (
                <div
                  className={`relative flex items-center justify-start p-4 shadow-md rounded-md mb-1  ${
                    isSelected === user.id
                      ? "bg-gradient-to-r from-blue-500 to-sky-400"
                      : "bg-white"
                  }`}
                  onClick={() => {
                    setIsSelected(user.id);
                    setSelectUser(user);
                  }}
                >
                  <img
                    src={user?.image}
                    alt="profilePicture"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div className="flex flex-col ml-2">
                    <h1
                      className={`${
                        isSelected === user.id ? "text-white" : "text-black"
                      }`}
                    >
                      {user?.name}
                    </h1>
                    {unreadMessage.some((item) => item.sender === user.id) ? (
                      <div className="flex items-center">
                        <h1 className="text-sm">ข้อความใหม่</h1>
                        <div className=" w-2 h-2 rounded-full bg-blue-500 ml-4"></div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )))}
              
        </div>

        {selectUser.length === 0 ? (
          <div className="w-3/4 h-full flex flex-col bg-gradient-to-r from-blue-500 to-sky-400 shadow-md justify-center items-center">
            <h1 className="text-4xl font-bold text-white tracking-wide">เลือกบทสนทนากับผู้ใช้งาน</h1>
          </div>
        ) : (
          <div className="w-3/4 h-full flex flex-col bg-white shadow-md">
            <div className="bg-sky-400  flex flex-col items-center justify-center w-full h-28 ">
              <h1 className="text-white text-xl">Chat with Us</h1>
              <h1 className="">{selectUser.name}</h1>
            </div>
            <div className="w-full h-full overflow-y-hidden">
              <ChatElement
                user={selectUser}
                getUnreadMessage={getUnreadMessage}
              />
            </div>
          </div>
        )}
        
      </main>
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
