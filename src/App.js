import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ใช้ React Router v6
import { auth } from "./firebase"; 
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import CommentSection from "./components/CommentSection"; // เพิ่ม CommentSection

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser); // ถ้าผู้ใช้ล็อกอินสำเร็จ
      } else {
        setUser(null); // ถ้าผู้ใช้ไม่ได้ล็อกอิน
      }
    });

    return () => {
      unsubscribe(); // คลีนอัพ unsubscribe เมื่อ Component ถูกทำลาย
    };
  }, []);

  return (
    <Router>
      <div className="App">
        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={() => auth.signOut()}>Sign Out</button>

            <Routes>
              <Route path="/posts" element={<PostList />} /> {/* แสดงโพสต์ทั้งหมด */}
              <Route path="/create" element={<PostForm />} /> {/* หน้าเพิ่มโพสต์ */}
              <Route path="/post/:postId" element={<CommentSection />} /> {/* หน้าแสดงคอมเมนต์ */}
            </Routes>
          </div>
        ) : (
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<SignIn />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
