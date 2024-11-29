import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase"; 
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

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

  const handleLoginSuccess = (email) => {
    // เก็บข้อมูลผู้ใช้ใน localStorage
    localStorage.setItem('username', email);
    setUser({ email });
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={handleLogout}>Sign Out</button>

            <Routes>
              <Route path="/posts" element={<PostList />} /> {/* แสดงโพสต์ทั้งหมด */}
              <Route path="/create" element={<PostForm />} /> {/* หน้าเพิ่มโพสต์ */}
            </Routes>
          </div>
        ) : (
          <Routes>
            <Route
              path="/signin"
              element={<SignIn onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/" element={<SignIn onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/signin" />} /> {/* หากผู้ใช้ไม่อยู่ในหน้าล็อกอินก็จะไปที่หน้า /signin */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
