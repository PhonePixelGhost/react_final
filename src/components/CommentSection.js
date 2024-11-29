import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"; // ใช้ Firestore API แบบใหม่
import { useParams } from "react-router-dom"; // ใช้ useParams สำหรับดึง postId จาก URL

const CommentSection = () => {
  const { postId } = useParams(); // ดึง postId จาก URL
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  // ฟังก์ชันดึงคอมเมนต์จาก subcollection
  const fetchComments = async () => {
    const commentsRef = collection(db, "posts", postId, "comments"); // ใช้ subcollection
    const querySnapshot = await getDocs(commentsRef);
    const commentsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments(commentsArray);
  };

  // ดึงคอมเมนต์เมื่อ postId เปลี่ยนหรือ component โหลด
  useEffect(() => {
    if (!postId) {
      console.error("Post ID is undefined");
      return;
    }
    fetchComments(); // ดึงข้อมูลคอมเมนต์จาก Firestore
  }, [postId]);

  // ฟังก์ชันสำหรับเพิ่มคอมเมนต์ใหม่
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (comment.trim() === "") {
      console.error("Comment cannot be empty");
      return;
    }

    try {
      // เพิ่มคอมเมนต์ใหม่ใน subcollection ของโพสต์
      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, {
        text: comment,
        username: "Anonymous",  // หรือใช้ username จาก props
        createdAt: serverTimestamp(), // ใช้ serverTimestamp สำหรับเวลา
      });

      setComment(""); // เคลียร์ฟอร์มหลังจากโพสต์คอมเมนต์
      fetchComments(); // ดึงคอมเมนต์ใหม่จาก Firestore
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div className="mt-3">
      <h3>Comments</h3>
      <form onSubmit={handleAddComment} className="d-flex mb-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="form-control me-2"
          required
        />
        <button type="submit" className="btn btn-primary">
          Post Comment
        </button>
      </form>

      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <p key={comment.id} className="mb-1">
              <strong>{comment.username}:</strong> {comment.text}
            </p>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
