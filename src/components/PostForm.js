import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore"; // ใช้ Firestore API แบบใหม่
import "./PostForm.css"; // นำเข้าไฟล์ CSS

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddPost = async (e) => {
    e.preventDefault();

    if (title.trim() === "" || content.trim() === "") {
      alert("Title and content are required!");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        timestamp: serverTimestamp(), // ใช้ serverTimestamp สำหรับเวลา
      });
      setTitle("");
      setContent("");
      alert("Post added successfully!");
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("Error adding post!");
    }
  };

  return (
    <div className="post-form-container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleAddPost} className="post-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="input-field"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
          className="input-field"
        />
        <button type="submit" className="submit-btn">
          Add Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;
