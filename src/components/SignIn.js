import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase"; // ใช้ signInWithEmailAndPassword
import { useNavigate } from "react-router-dom";

const SignIn = ({ onLoginSuccess }) => { // รับ props onLoginSuccess สำหรับการจัดการสถานะการล็อกอินใน App.js
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password) // ใช้ฟังก์ชัน signInWithEmailAndPassword
      .then((authUser) => {
        console.log(authUser);
        // เรียกใช้ onLoginSuccess จาก props เพื่อจัดการสถานะการล็อกอินใน App.js
        onLoginSuccess(authUser.user.email); // ส่ง email ผู้ใช้ไปยัง App.js
        // ไปที่หน้า /posts หรือหน้าอื่น ๆ ที่ต้องการ
        navigate("/posts"); // หรือ /dashboard
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
