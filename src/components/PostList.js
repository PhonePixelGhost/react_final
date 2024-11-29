import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // เชื่อมต่อกับ firebase
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"; // ใช้ deleteDoc สำหรับการลบโพสต์
import { Link, useNavigate } from "react-router-dom"; // ใช้ useNavigate สำหรับการเปลี่ยนหน้า
import "./PostList.css"; // นำเข้าไฟล์ CSS

const PostList = () => {
  const [posts, setPosts] = useState([]); // เก็บโพสต์
  const [likes, setLikes] = useState({}); // เก็บจำนวนไลค์
  const [likedPosts, setLikedPosts] = useState({}); // เก็บสถานะการไลค์
  const [editPost, setEditPost] = useState(null); // เก็บข้อมูลโพสต์ที่จะแก้ไข
  const [updatedTitle, setUpdatedTitle] = useState(""); // เก็บชื่อโพสต์ใหม่
  const [updatedContent, setUpdatedContent] = useState(""); // เก็บเนื้อหาโพสต์ใหม่
  const navigate = useNavigate(); // ใช้ navigate สำหรับการเปลี่ยนหน้า

  // ดึงข้อมูลโพสต์จาก Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, "posts");
      const snapshot = await getDocs(postsCollection);
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

    const postRef = doc(db, "posts", postId);
    try {
      await updateDoc(postRef, {
        likes: currentLikes + 1, // เพิ่มจำนวนไลค์
      });

      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: currentLikes + 1, // อัพเดทจำนวนไลค์ที่แสดงบนหน้า
      }));

      setLikedPosts((prev) => ({
        ...prev,
        [postId]: true, // ผู้ใช้ไลค์โพสต์นี้แล้ว
      }));
    } catch (error) {
      console.error("Error updating like: ", error);
    }
  };

  // ฟังก์ชันการลบโพสต์
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        const postRef = doc(db, "posts", postId);
        await deleteDoc(postRef); // ลบโพสต์จาก Firestore
        alert("Post deleted successfully!");
        setPosts(posts.filter(post => post.id !== postId)); // อัพเดตหน้าจอหลังจากลบโพสต์
      } catch (error) {
        console.error("Error deleting post: ", error);
        alert("Error deleting post.");
      }
    }
  };

  // ฟังก์ชันการแก้ไขโพสต์
  const handleEdit = (post) => {
    setEditPost(post); // ตั้งค่าผู้โพสต์ที่ต้องการแก้ไข
    setUpdatedTitle(post.title); // ตั้งค่าชื่อโพสต์ที่ต้องการแก้ไข
    setUpdatedContent(post.content); // ตั้งค่าเนื้อหาของโพสต์ที่ต้องการแก้ไข
  };

  // ฟังก์ชันสำหรับบันทึกการแก้ไข
  const handleSaveEdit = async () => {
    if (updatedTitle === "" || updatedContent === "") {
      alert("Please fill out both fields!");
      return;
    }

    const postRef = doc(db, "posts", editPost.id);
    try {
      await updateDoc(postRef, {
        title: updatedTitle,
        content: updatedContent,
      });

      setPosts(posts.map((post) => post.id === editPost.id ? { ...post, title: updatedTitle, content: updatedContent } : post)); // อัปเดตโพสต์ในหน้า
      setEditPost(null); // รีเซ็ตการแก้ไข
      setUpdatedTitle(""); // รีเซ็ตชื่อโพสต์
      setUpdatedContent(""); // รีเซ็ตเนื้อหาโพสต์
    } catch (error) {
      console.error("Error updating post: ", error);
      alert("Error updating post.");
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
            {/* ปุ่มลบโพสต์ */}
            <button onClick={() => handleDelete(post.id)} className="delete-btn">
              Delete Post
            </button>

            {/* ปุ่มแก้ไขโพสต์ */}
            <button onClick={() => handleEdit(post)} className="edit-btn">
              Edit Post
            </button>

            {/* ปุ่มไลค์ */}
            <button
              onClick={() => handleLike(post.id, post.likes || 0)} // ส่ง postId และจำนวนไลค์ปัจจุบัน
              className={`like-btn ${likedPosts[post.id] ? "liked" : ""}`} // เพิ่ม class liked หากไลค์แล้ว
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

      {/* ฟอร์มการแก้ไขโพสต์ */}
      {editPost && (
        <div className="edit-form-container">
          <h2>Edit Post</h2>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            placeholder="Edit Post Title"
          />
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            placeholder="Edit Post Content"
          />
          <button onClick={handleSaveEdit} className="save-edit-btn">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
