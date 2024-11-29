import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // เชื่อมต่อกับ firebase
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore"; // เพิ่ม addDoc และ serverTimestamp ที่นี่
import { useParams } from "react-router-dom"; // ใช้ useParams สำหรับดึง postId จาก URL

const CommentSection = () => {
  const { postId } = useParams(); // ดึง postId จาก URL
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const q = query(collection(db, "comments"), where("postId", "==", postId));
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map((doc) => doc.data());
      setComments(commentsData);
    };

    fetchComments();
  }, [postId]);

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
