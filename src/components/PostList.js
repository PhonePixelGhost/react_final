import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore"; // ใช้ Firestore API แบบใหม่
import { Link } from "react-router-dom"; // ใช้ Link สำหรับการนำทางไปยังหน้า PostForm
import "./PostList.css"; // เพิ่มการ import CSS

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({}); // สร้าง state สำหรับเก็บจำนวนไลค์

  // ดึงข้อมูลโพสต์จาก Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, "posts"); // ใช้ collection() ให้ถูกต้อง
      const snapshot = await getDocs(postsCollection);  // ใช้ getDocs() เพื่อดึงข้อมูล
      const postList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })); // เพิ่ม id สำหรับแต่ละโพสต์
      setPosts(postList);
    };

    fetchPosts();
  }, []);

  const handleLike = (postId) => {
    setLikes((prevLikes) => {
      const newLikes = { ...prevLikes };
      newLikes[postId] = (newLikes[postId] || 0) + 1; // เพิ่มจำนวนไลค์ของโพสต์
      return newLikes;
    });
  };

  return (
    <div className="posts-container">
      {/* ปุ่มเพื่อไปหน้าเพิ่มโพสต์ */}
      <div className="create-post-container">
        <Link to="/create" className="create-post-btn">
          Create Post
        </Link>
      </div>

      {/* แสดงโพสต์ทั้งหมด */}
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <div className="post-header">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>
          </div>

          <div className="post-footer">
            {/* ปุ่มไลค์ */}
            <button onClick={() => handleLike(post.id)} className="like-btn">
              Like {likes[post.id] || 0} {/* แสดงจำนวนไลค์ */}
            </button>

            {/* ลิงก์ไปที่หน้าคอมเม้นต์ */}
            <Link to={`/post/${post.id}`} className="comment-btn">
              Comment
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
