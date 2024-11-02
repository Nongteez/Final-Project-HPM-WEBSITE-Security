"use server";

import Navbar from "../components/Navbar";
import { ToastContainer, toast, Bounce } from "react-toastify";
import PostComponent from "../components/PostComponent";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { GetPost } from "../components/action/PostAction";

const getPost = async () => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_serverURL + "/api/post");
    const data = await res.json();
    const formattedPost = data.reduce((acc, item) => {
      let post = acc.find((post) => post.postId === item.post_id);

      if (!post) {
        post = {
          postId: item.post_id,
          postText: item.post_text,
          postImage: item.post_image,
          postUserId: item.post_userId,
          postUserName: item.post_user_name,
          postUserImage: item.post_user_image,
          postLikes: item.count_likes,
          postCreateAt: item.post_create_at,
          comments: [],
          showComments: false,
          commentText: "",
        };
        acc.push(post);
      }

      if (item.comment_id) {
        post.comments.push({
          commentId: item.comment_id,
          commentText: item.comment_text,
          commentImage: item.comment_image,
          commentUser: item.comment_userId,
          commentUserName: item.comment_user_name,
          commentUserImage: item.comment_user_image,
          commentCreateAt: item.comment_create_at,
        });
      }

      return acc;
    }, []);
   

    return formattedPost;
  } catch (error) {
    console.log(error);
  }
};

export default async function Community() {
  const session = await getServerSession();
 if(!session) redirect("/");
 
  const posts = await GetPost();

 

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto pt-10 px-6">
        <h1 className="text-3xl font-bold text-center text-DB my-2 tracking-wide">
          โพสต์ทั้งหมด
        </h1>
        <PostComponent initialPosts={posts.data} />
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
