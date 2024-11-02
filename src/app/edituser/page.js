"use server";


import Link from "next/link";
import { UserRoundPen, UserX } from "lucide-react";
import Swal from "sweetalert2";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import EditUserModal from "../components/EditUserModal";
import "react-toastify/dist/ReactToastify.css";
import { GetUserData } from "../components/action/UserAction";


export default async function EditUser() {

  const session = await getServerSession();
  // if (!session) redirect("/");
  const users = await GetUserData();

  return (
    <>
      <h1 className="text-3xl font-semibold text-center text-DB mb-2">
        จัดการผู้ใช้
      </h1>
    <EditUserModal initialUser={users.data}/>
    {users.error && (
      <div className="text-red-500">{users.error}</div>
    )}

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
