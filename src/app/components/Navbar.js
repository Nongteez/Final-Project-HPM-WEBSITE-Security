"use client";

import { FaRegBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const pathname = usePathname();
  
 
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name);
      setEmail(session.user.email);
    }
  }, [session]);

  const handleChangeProfile = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_serverURL +
          `/api/updateuser/profile/data/${session?.user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        }
      );

      if (image) {
        try {
          const formData = new FormData();
          formData.append("image", image);

          const res = await fetch(
            process.env.NEXT_PUBLIC_serverURL +
              `/api/updateuser/profile/image/${session?.user?.id}`,
            {
              method: "PUT",
              body: formData,
            }
          );

          if (!res.ok) {
            toast.error("อัพโหลดรูปภาพไม่สําเร็จ");
          }
        } catch (error) {
          toast.error("อัพโหลดรูปภาพไม่สําเร็จ");
        }
      }
      if (res.ok) {
        await updateSession();
        document.getElementById("profile_modal").close();
        toast.success("อัพเดทข้อมูลสําเร็จ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  

  
  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-300/80">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0 cursor-pointer">
            <img src="/images/logo/smile-logo-blue-rm.png" />
            <Link href={session ? "/homepage" : "/"}>
              <span className="text-xl tracking-tight">Happy Mind</span>
            </Link>
            {session?.user && (
              <ul className="hidden lg:flex ml-14 space-x-10">
              <li
                className={`hover:decoration-DB hover:underline hover:decoration-solid hover:decoration-2 hover:underline-offset-4 ${
                  pathname === "/homepage" ? "text-DB" : ""
                }`}
              >
                <Link href={"/homepage"}>หน้าหลัก</Link>
              </li>
              <li
                className={`hover:decoration-DB hover:underline hover:decoration-solid hover:decoration-2 hover:underline-offset-4 ${
                  pathname === "/result" ? "text-DB" : ""
                }`}
              >
                <Link href={"/result"}>ผลลัพธ์</Link>
              </li>
              <li
                className={`hover:decoration-DB hover:underline hover:decoration-solid hover:decoration-2 hover:underline-offset-4 ${
                  pathname === "/edituser" ? "text-DB" : ""
                }`}
              >
                <Link href={"/edituser"}>จัดการผู้ใช้</Link>
              </li>
              <li
                className={`hover:decoration-DB hover:underline hover:decoration-solid hover:decoration-2 hover:underline-offset-4 ${
                  pathname === "/media" ? "text-DB" : ""
                }`}
              >
                <Link href={"/media"}>สื่อความรู้</Link>
              </li>
              <li
                className={`hover:decoration-DB hover:underline hover:decoration-solid hover:decoration-2 hover:underline-offset-4 ${
                  pathname === "/community" ? "text-DB" : ""
                }`}
              >
                <Link href={"/community"}>โพสต์ชุมชน</Link>
              </li>
              <li
                className={`hover:decoration-DB hover:underline hover:decoration-solid hover:decoration-2 hover:underline-offset-4 ${
                  pathname === "/support" ? "text-DB" : ""
                }`}
              >
                <Link href={"/support"}>ศูนย์การช่วยเหลือ</Link>
              </li>
            </ul>
            )}
            
          </div>
          

          {session?.user ? (
           <>
           
<div className="hidden lg:flex w-1/5 md:w-1/4 items-center justify-end space-x-4 ">
              {/* dropdown menu profile */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar online"
                >
                  <div className="w-10 rounded-full">
                    {/* image profile */}

                    <img src={session?.user?.image} className="w-12 h-12" />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow space-y-2"
                >
                  <li>
                    <a
                      className="justify-between"
                      onClick={() =>
                        document.getElementById("profile_modal").showModal()
                      }
                    >
                      แก้ไขโปรไฟล์
                    </a>
                  </li>

                  <li>
                    <a
                      onClick={() => signOut()}
                      className="bg-gradient-to-r from-DB to-LB text-white"
                    >
                      <span className="mr-2  ">
                        <LogOut size={20} />
                      </span>
                      ออกจากระบบ
                    </a>
                  </li>
                </ul>
              </div>
            </div>
           </> 
          
          ) : (
            <div className="hidden lg:flex justify-center space-x-12 items-center">
              <Link
                href="/login2Fa"
                className="border bg-gradient-to-br from-DB to-LB  p-2 rounded-lg text-white w-28 flex justify-center"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          )}

          <div className="lg:hidden md:flex flex-col justify-end">
            {session?.user ?(
               <button onClick={toggleMobileDrawer}>
               {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
             
            ):(
              <Link
              href="/login"
              className="border bg-DB  py-2 px-3 rounded  text-white"
            >
              เข้าสู่ระบบ
            </Link>
            )}
           
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-gradient-to-b from-DB from-70% to-LB w-full p-12 flex flex-col justify-center items-center mt-3  lg:hidden">
            {session?.user && (
               <ul className="flex flex-col space-y-4 my-3">
               <li>
                 <Link
                   href={"/homepage"}
                   className="text-white"
                 >
                   หน้าหลัก
                 </Link>
               </li>
               <li>
                 <Link
                   href={"/result"}
                   className="text-white"
                 >
                   ผลลัพธ์
                 </Link>
               </li>
               <li>
                 <Link
                   href={"/edituser"}
                   className="text-white"
                 >
                   จัดการผู้ใช้
                 </Link>
               </li>
               <li>
                 <Link
                   className="text-white"
                   href={"/media"}
                 >
                   สื่อความรู้
                 </Link>
               </li>
               <li>
                 <Link
                   className="text-white"
                   href={"/community"}
                 >
                   โพสต์ชุมชน
                 </Link>
               </li>
               <li>
                 <Link
                   href={"/support"}
                   className="text-white"
                 >
                   ศูนย์การช่วยเหลือ
                 </Link>
               </li>
             </ul>
            )}
           
            {session?.user ? (
              <div className="flex w-1/5 max-sm:w-full sm:w-full items-center justify-around">
                <img
                  src={session?.user?.image}
                  className="w-12 h-12 rounded-full"
                />

                <button
                  onClick={() => signOut()}
                  className="bg-DB text-white  py-2 px-3 rounded flex"
                >
                  <span className="mr-2">
                    <LogOut size={20} />
                  </span>
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="flex space-x-6">
                <Link
                  href="/login"
                  className="border bg-DB  py-2 px-3 rounded  text-white"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {/* modal profile edit */}
      <dialog id="profile_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {/* bg top */}
          <div className="bg-gradient-to-r from-DB to-LB w-full h-1/6 absolute top-0 left-0 -z-10"></div>
          {/* detail profile */}
          <div className="flex flex-col p-4 ">
            <div className="flex flex-col space-y-1 mb-4">
              <img
                src={session?.user?.image}
                alt={session?.user?.name}
                className="w-16 h-16 rounded-full"
              />
              <h1 className="text-xl">{session?.user?.name}</h1>
              <h1>{session?.user?.email}</h1>
            </div>

            {/* form group detail */}
            <div className="flex flex-col space-y-2">
              <hr />
              <div className="flex flex-row justify-between py-2">
                <h1>Name</h1>
                <input
                  className=" input input-bordered w-1/2  "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <hr />
              <div className="flex flex-row justify-between py-2">
                <h1>Email</h1>
                <input
                  className=" input input-bordered w-1/2 "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <hr />
              <div className="flex flex-row justify-between py-2">
                <h1>Profile</h1>
                <div className="flex justify-end space-x-4">
                  {preview ? (
                    <img src={preview} className="w-12 h-12 rounded-full" />
                  ) : (
                    <img
                      src={session?.user?.image}
                      className="w-12 h-12 rounded-full"
                    />
                  )}

                  <input
                    type="file"
                    id="imageProfile"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      const src = URL.createObjectURL(e.target.files[0]);
                      setPreview(src);
                    }}
                    className="file-input input-xs  input-bordered w-32 "
                  />
                </div>
              </div>
              <hr />
            </div>
          </div>
          {/* submit and cancel button */}
          <div className="flex justify-end space-x-2">
            <button
              className="btn btn-sm btn-outline text-lg"
              onClick={() => {
                document.getElementById("profile_modal").close();
                setPreview(null);
              }}
            >
              ยกเลิก
            </button>
            <button
              className="btn btn-sm btn-outline bg-gradient-to-r from-DB to-LB text-white text-lg"
              onClick={() => handleChangeProfile()}
            >
              บันทึก
            </button>
          </div>
        </div>
      </dialog>
    </nav>
  );
}
