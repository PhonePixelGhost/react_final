import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";
import "./CommentSection.css"; // เพิ่มการ import CSS

const CommentSection = () => {
  const { postId } = useParams();
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
        timestamp: serverTimestamp(),
      });
      setComment(""); // เคลียร์ฟอร์มหลังจากโพสต์คอมเมนต์
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          className="comment-input"
        />
        <button type="submit" className="comment-btn">Post Comment</button>
      </form>

      {/* แสดงข้อความถ้ายังไม่มีคอมเมนต์ */}
      {comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <p>{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
