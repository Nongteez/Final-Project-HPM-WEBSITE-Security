import { query } from "../../../../lib/ConnectDb";

export async function GetPost(){
    try {
        const result = await query(`SELECT * FROM full_post_view`);
        if(result.length < 1) return {error : "No post found"}
        const formattedPost = result.reduce((acc, item) => {
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
         
      
          return {data : formattedPost};
    } catch (error) {
        return {error : error.message}
    }
}