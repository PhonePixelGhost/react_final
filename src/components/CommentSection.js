import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore"; // ใช้ Firestore API แบบใหม่
import { useParams } from "react-router-dom"; // ใช้ useParams สำหรับดึง postId จาก URL

const CommentSection = () => {
  const { postId } = useParams(); // ดึง postId จาก URL
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  // ตรวจสอบว่า postId มีค่า
  useEffect(() => {
    if (!postId) {
      console.error("Post ID is undefined");
      return;
    }

    const fetchComments = async () => {
      const q = query(collection(db, "comments"), where("postId", "==", postId));
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map((doc) => doc.data());
      setComments(commentsData);
    };

    fetchComments();
  }, [postId]);

  // ฟังก์ชันสำหรับเพิ่มคอมเมนต์ใหม่
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (comment.trim() === "") {
      console.error("Comment cannot be empty");
      return;
    }

    try {
      await addDoc(collection(db, "comments"), {
        postId,
        comment,
        timestamp: serverTimestamp(), // ใช้ serverTimestamp แทน new Date() สำหรับเวลา
      });
      setComment(""); // เคลียร์ฟอร์มหลังจากโพสต์คอมเมนต์
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleAddComment}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Post Comment</button>
      </form>
      <div>
        {comments.map((comment, index) => (
          <div key={index}>
            <p>{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
