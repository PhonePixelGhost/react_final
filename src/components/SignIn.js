import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from "../firebase"; // นำเข้า Firebase Auth
import { useNavigate } from "react-router-dom";
import "./SignIn.css";  // นำเข้าไฟล์ CSS ของ SignIn

const SignIn = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password) // ใช้ฟังก์ชัน signInWithEmailAndPassword ตามรูปแบบใหม่
      .then((authUser) => {
        console.log(authUser);
        // ไปที่หน้า dashboard หรือหน้าอื่นๆ หลังจากเข้าสู่ระบบสำเร็จ
        onLoginSuccess(authUser.user.email); // ส่งข้อมูลผู้ใช้ไปยัง onLoginSuccess
        navigate("/posts"); // ไปที่หน้า posts
      })
      .catch((error) => alert(error.message)); // แสดงข้อความผิดพลาด
  };

  return (
    <div className="sign-in-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn} className="sign-in-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="input-field"
        />
        <button type="submit" className="submit-btn">
          Sign In
        </button>
      </form>

      {/* ปุ่ม Sign Up สำหรับผู้ที่ยังไม่ได้สมัคร */}
      <div className="sign-up-link">
        <p>Don't have an account?</p>
        <button
          onClick={() => navigate("/signup")}
          className="sign-up-btn"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignIn;
