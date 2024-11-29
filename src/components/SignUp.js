import React, { useState } from "react";
import { auth, createUserWithEmailAndPassword } from "../firebase"; // นำเข้า Firebase Authentication
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate เพื่อเปลี่ยนเส้นทาง
import "./SignUp.css"; // นำเข้าไฟล์ CSS สำหรับการตกแต่ง

const SignUp = () => {
  const [email, setEmail] = useState(""); // เก็บค่าอีเมล
  const [password, setPassword] = useState(""); // เก็บค่ารหัสผ่าน
  const [errorMessage, setErrorMessage] = useState(""); // เก็บข้อความข้อผิดพลาด
  const navigate = useNavigate(); // ใช้ navigate เพื่อเปลี่ยนหน้า

  const handleSignUp = (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า

    if (email === "" || password === "") {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    // ใช้ Firebase Authentication ลงทะเบียนผู้ใช้ใหม่
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        console.log(authUser);
        // หลังจากสมัครสมาชิกสำเร็จแล้ว พาผู้ใช้ไปหน้า /signin
        setErrorMessage(""); // เคลียร์ข้อความข้อผิดพลาด
        navigate("/signin"); // ไปที่หน้า SignIn
      })
      .catch((error) => {
        // จับข้อผิดพลาด เช่น อีเมลซ้ำ
        console.error(error.message);
        setErrorMessage(error.message); // แสดงข้อผิดพลาด
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-heading">Create Account</h2>
        <form onSubmit={handleSignUp} className="signup-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // เก็บค่าอีเมล
            placeholder="Email"
            className="signup-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // เก็บค่ารหัสผ่าน
            placeholder="Password"
            className="signup-input"
            required
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* แสดงข้อความข้อผิดพลาด */}
        <p className="login-link">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
