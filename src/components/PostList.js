import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; // ใช้ Firestore API แบบใหม่
import { Link } from "react-router-dom"; // ใช้ Link สำหรับการนำทางไปยังหน้า PostForm
import "./PostList.css"; // เพิ่มการ import CSS

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({}); // สร้าง state สำหรับเก็บจำนวนไลค์
  const [likedPosts, setLikedPosts] = useState({}); // เก็บสถานะการไลค์

  // ดึงข้อมูลโพสต์จาก Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, "posts"); // ใช้ collection() ให้ถูกต้อง
      const snapshot = await getDocs(postsCollection);  // ใช้ getDocs() เพื่อดึงข้อมูล
      const postList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPosts(postList);
    };

    fetchPosts();
  }, []);

  // ฟังก์ชันการไลค์โพสต์
  const handleLike = async (postId, currentLikes) => {
    if (likedPosts[postId]) {
      return; // หากผู้ใช้ได้ไลค์โพสต์นี้แล้ว จะไม่ให้ไลค์ซ้ำ
    }

    // อัพเดทสถานะไลค์ในฐานข้อมูล
    const postRef = doc(db, "posts", postId);
    try {
      await updateDoc(postRef, {
        likes: currentLikes + 1,  // เพิ่มจำนวนไลค์
      });

      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: currentLikes + 1, // อัพเดทจำนวนไลค์ที่แสดงบนหน้า
      }));

      // อัพเดทสถานะการไลค์
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: true, // ผู้ใช้ไลค์โพสต์นี้แล้ว
      }));
    } catch (error) {
      console.error("Error updating like: ", error);
    }
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
            <button
              onClick={() => handleLike(post.id, post.likes || 0)} // ส่ง postId และจำนวนไลค์ปัจจุบัน
              className="like-btn"
              disabled={likedPosts[post.id]} // ถ้าไลค์แล้วให้ปิดปุ่ม
            >
              {likedPosts[post.id] ? "Liked" : "Like"} ({likes[post.id] || post.likes || 0})
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
