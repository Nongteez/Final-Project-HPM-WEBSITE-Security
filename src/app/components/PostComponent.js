'use client'
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { FaHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { toast, ToastContainer, Bounce } from "react-toastify";
import Swal from "sweetalert2";
import {FaTrash} from "react-icons/fa";
import { ArrowBigUp } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";



export default function PostComponent({initialPosts}) {
    const [posts, setPosts] = useState(initialPosts);
    const [commentText, setCommentText] = useState({});
    const { data: session } = useSession();
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState("all");
    const [topComment, setTopComment] = useState(false);
    const [loading, setLoading] = useState(true);
    const [topLikes, setTopLikes] = useState(false);
    const [postText , setPostText] = useState("");
    const [uploadImage , setUploadImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isScrolled, setIsScrolled ] = useState(false);
    const scrollDivRef = useRef(null);
    const [commentImage , setCommentImage] = useState(null);

    function formatDay(createAt) {
        const date = new Date(createAt);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return ` ${day}/${month}/${year}`;
      }
    
      function formatTime(createAt) {
        const date = new Date(createAt);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return ` ${hours}:${minutes}`;
      }
      const toggleComments = (postId) => {
        const post = posts.find((post) => post.postId === postId);
        if (post.comments.length === 0) return false;
    
        setPosts(
          posts.map((post) =>
            post.postId === postId
              ? { ...post, showComments: !post.showComments }
              : post
          )
        );
      };
    
      const handleComment = async (postId) => {
        const text = commentText[postId];
        if (!text) {
          toast.error("กรุณาใส่ความคิดเห็น");
          return;
        }
        try {
          const res = await fetch("/api/post/comment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postId,
              userId: session.user.id,
              text,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            setCommentText((prev) => ({ ...prev, [postId]: "" }));
            toast.success("เขียนความคิดเห็นสําเร็จ");
            getPost();
          } else {
            toast.error("เกิดข้อผิดพลาด: " + (data.message || "ไม่ทราบ"));
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      const handleWriteComment = (postId, text) => {
        setCommentText((prev) => ({ ...prev, [postId]: text }));
        
      };

      const getPost = async () => {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_serverURL +"/api/post");
          const data = await res.json();
          if(res.ok){
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
            
            setPosts(formattedPost);
        
           
          }
         
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }

      const handlePost = async () => {
        if(!postText){
          toast.error("กรุณาใส่ข้อความ");
          return;
        }
        document.getElementById("loadingModal").showModal();
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_serverURL + "/api/post", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: session.user.id,
              text: postText,
             
            }),
          })
          const data = await res.json();
          
          if(res.ok){
            const id = data.id
            if(uploadImage){
              const formData = new FormData();
            formData.append("image", uploadImage);
            try {
              const res = await fetch(process.env.NEXT_PUBLIC_serverURL + `/api/post/image/${id}`, {
                method: "PUT",
                body: formData
              })
              const data = await res.json();
              if(!res.ok){
                if(data.error === "ไฟล์ต้องมีขนาดน้อยกว่า 2.5 MB"){
                  toast.error("ไฟล์ต้องมีขนาดน้อยกว่า 2.5 MB");
                }else if(data.error === "ไฟล์ต้องเป็นนามสกุล .jpg หรือ .png"){
                  toast.error("ไฟล์ต้องเป็นนามสกุล .jpg หรือ .png");
                }
                document.getElementById("loadingModal").close();
                document.getElementById("newPost").close();
                return;

              }
             
            } catch (error) {
              console.log(error);
              toast.error("เกิดข้อผิดพลาด");
            }
            }
            document.getElementById("loadingModal").close();
            document.getElementById("newPost").close();
              toast.success("โพสต์สําเร็จ");
              setPostText("");
              setUploadImage(null);
              setPreview(null);
              getPost();
            
            
          }
        } catch (error) {
          console.log(error);
          toast.error("เกิดข้อผิดพลาด");
        }
      }

      const handleDeletePost = async (postId) => {
        if(!postId) return;
        Swal.fire({
          position: "center",
          title: "คุณต้องการลบโพสต์ใช่หรือไม่ ?",
          text: `ต้องการลบโพสต์ใช่ไหม`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3b82f6",
          confirmButtonText: "ลบ",
          cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const resData = await fetch(`/api/post/${postId}`, {
                method: "DELETE",
              });
              const resImg = await fetch(`/api/post/image/${postId}`, {
                method: "DELETE",
              });
              if (!resData.ok || !resImg.ok) {
                toast.error("ลบโพสต์ไม่สําเร็จ");
              }
              if (resData.ok && resImg.ok) {
                toast.success("ลบโพสต์สําเร็จ");
                getPost();
              }
            } catch (error) {
              toast.error("ลบโพสต์ไม่สําเร็จ");
              console.log(error);
            }
          }
        });
      }
     
      const scrollToTop = () => {
        scrollDivRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      };
      

      useEffect(() => {
        const handleScroll = () => {
          if (scrollDivRef.current.scrollTop > 300) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        };
    
        const scrollDiv = scrollDivRef.current;
        scrollDiv.addEventListener('scroll', handleScroll);
    
        return () => {
          scrollDiv.removeEventListener('scroll', handleScroll);
        };
      }, []);
    
      
  return (
    <>
     <div className="w-full flex justify-around ">
          <div className="hidden  lg:w-1/4 h-[500px] bg-gradient-to-br from-DB via-B to-LB rounded-md shadow-md drop-shadow-lg  space-y-4 lg:flex flex-col p-4">
          <button className="btn bg-white w-full text-blue-500 tracking-wider text-lg" onClick={()=> document.getElementById("newPost").showModal()}>เพิ่มโพสต์ใหม่</button>

            <div className="flex items-end justify-start">
            <h1 className="text-lg text-white">ค้นหา</h1>
          <div className=" dropdown dropdown-start">
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
                <p>ค้นหาโพสต์ที่ต้องการจากเนื้อหาภายในโพสต์นั้นๆ</p>
              </div>
            </div>
          </div>
          </div>
            <input
              type="search"
              className="w-full h-12 bg-white rounded-md shadow-md p-2"
              placeholder="ค้นหาโพสต์"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            

            <div className="mt-4 space-y-4">
              <h1 className="text-lg text-white">เรียงตาม</h1>
              <div className="form-control rounded-md bg-white p-2">
                <label className="label cursor-pointer ">
                  <span className="label-text  text-md">
                    จำนวนคอมเมนต์มากที่สุด
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox bg-white"
                    onChange={() => setTopComment(!topComment)}
                  />
                </label>
              </div>
              {/* <div className="form-control rounded-md bg-white p-2">
                <label className="label cursor-pointer">
                  <span className="label-text  text-md">
                    จำนวนไลค์มากที่สุด
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox bg-white"
                    onChange={() => setTopLikes(!topLikes)}
                  />
                </label>
              </div> */}
              <h1 className="text-lg text-white">เลือกช่วงเวลา</h1>
              <select
                className="select select-bordered w-full"
                onChange={(e) => setDateRange(e.target.value)}
                value={dateRange}
              >
                <option value="all">ทั้งหมด</option>
                <option value="today">วันนี้</option>
                <option value="week">สัปดาห์นี้</option>
                <option value="month">เดือนนี้</option>
              </select>
            </div>
          </div>
         
          <div className="flex flex-col  lg:w-3/4 p-4 max-sm:w-full sm:w-full h-[calc(100vh-220px)] overflow-y-scroll no-scrollbar" ref={scrollDivRef}>
            {posts &&
              posts?.length > 0 && posts
                .filter((post) => {
                  if (dateRange === "all") return true;
                  const postDate = new Date(post.postCreateAt);
                  const now = new Date();
                  if (dateRange === "today") {
                    return postDate.toDateString() === now.toDateString();
                  } else if (dateRange === "week") {
                    return postDate >= now.setDate(now.getDate() - 7);
                  } else if (dateRange === "month") {
                    return postDate >= now.setMonth(now.getMonth() - 1);
                  }
                  return true;
                })
                .filter((post) => {
                  if (search === "") return true;
                  return post.postText.includes(search)||post.postUserName.includes(search);
                })
                .sort((a, b) => {
                  if (topComment) {
                    return b.comments.length - a.comments.length;
                  }
                    return new Date(b.postCreateAt) - new Date(a.postCreateAt);
                  
                  
                  
                })
                .map((post, index) => (
                  <div
                    key={index}
                    className="mb-8 p-4 flex flex-col bg-white w-auto rounded-lg drop-shadow-lg shadow-xl "
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={post?.postUserImage}
                        alt={post?.postUserName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="ml-2 font-medium">
                          {post?.postUserName}
                        </span>
                        <span className="ml-2 text-sm">
                          {formatTime(post?.postCreateAt)}
                        </span>
                      </div>
                      
                        <div className="ml-auto">
                          <button
                            className="ml-auto"
                            onClick={() => handleDeletePost(post?.postId)}
                          >
                            <FaTrash className="text-blue-500" />
                          </button>
                        </div>
                      
                    </div>
                    <p className="p-2">{post?.postText}</p>
                    
                    {post?.postImage && (
                      <img
                        src={post?.postImage}
                        alt="Post Image"
                        className="my-4 rounded-sm"
                      />
                    )}

                    <span className="mt-2 text-sm flex justify-end">
                      {formatDay(post?.postCreateAt)}
                    </span>
                    <hr />
                    <div className="flex my-2">
                      
                      <div
                        className="ml-4 flex items-center cursor-pointer"
                        onClick={() => toggleComments(post?.postId)}
                      >
                        <FaRegCommentAlt className="mr-2" />
                        {post?.comments?.length} Comments
                      </div>
                    </div>
                    <hr />
                    {post?.showComments && (
                      <div className="mt-4">
                        {post.comments.length > 0 &&
                          post.comments.map((comment, idx) => (
                            <div key={idx} className="mt-2 pl-4 ">
                              <div className="flex items-center mb-2">
                                <img
                                  src={comment?.commentUserImage}
                                  alt={comment?.commentUserName}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex flex-col">
                                  <span className="ml-2">
                                    {comment?.commentUserName}
                                  </span>
                                  <span className="ml-2 text-sm">
                                    {formatTime(comment?.commentCreateAt)}
                                  </span>
                                </div>
                              </div>
                              <p className="">{comment?.commentText}</p>
                              {comment?.commentImage && (
                                <img
                                  src={comment?.commentImage}
                                  alt="Comment Image"
                                  className="my-2"
                                />
                              )}
                              <hr className="my-2" />
                            </div>
                          ))}
                      </div>
                    )}
                    <input
                      className="w-full p-2 rounded-lg input input-bordered mt-2 input-sm"
                      placeholder="เขียนความคิดเห็น..."
                      type="text"
                      value={commentText[post.postId] || ""}
                      onChange={(e) =>
                        handleWriteComment(post.postId, e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleComment(post.postId)
                      }
                    />
                  </div>
                ))
            }
            
          </div>
        </div>
        {isScrolled && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg"
      >
      <ArrowBigUp size={30} />
      </button>
    )}
        <dialog id="newPost" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                setPostText("");
                setUploadImage(null);
                setPreview(null);
              }}
            >
              ✕
            </button>
          </form>
          {/* bg top */}
          {/* <div className="bg-sky-200 w-full h-[15%] absolute top-0 left-0 -z-10"></div> */}
          {/* detail profile */}
          <div className="flex flex-col p-4 mt-4 ">
            {/* form group detail */}
            <div className="flex flex-col space-y-2">
              <h1>โพสต์</h1>
              <hr />
              <div className="flex flex-row justify-between py-2">
                <h1>เนื้อหา</h1>
                <textarea 
                  className="textarea textarea-bordered w-4/5  "
                  value={postText}
                  onChange={(e) => {
                    setPostText(e.target.value);
                  }}
                />
              </div>

              <hr />
              
              <div className="flex flex-row justify-between py-2">
                <div className="flx flex-col">
                <h1>รูปประกอบ</h1>
                  <p className="text-sm">*ถ้ามี*</p>
                </div>
                <div className="flex flex-col items-center justify-center space-x-4">
                  {preview && (
                    <img
                      src={preview}
                      className="max-w-2xl rounded-md shadow-md max-sm:w-full"
                    />
                  )}
                  <h1 className="py-2">เลือกรูปภาพใหม่</h1>
                  <input
                    type="file"
                    id="imageProfile"
                    onChange={(e) => {
                      const src = URL.createObjectURL(e.target.files[0]);
                      setPreview(src);
                      setUploadImage(e.target.files[0]);
                    }}
                    className="file-input input-xs  input-bordered w-32 my-2"
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
                document.getElementById("newPost").close();
                setPostText("");
                setUploadImage(null);
                setPreview(null);
               
              }}
            >
              ยกเลิก
            </button>
            <button
              className="btn btn-sm btn-outline tracking-wider bg-blue-500 text-white text-lg"
              onClick={handlePost}
            >
              บันทึก
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="loadingModal" className="modal">
        <div className="modal-box w-auto flex items-center justify-center">
          <span className="loading loading-dots loading-lg bg-blue-500"></span>
        </div>
      </dialog>
    </>
  )
}
