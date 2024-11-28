import React, { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase"; // นำเข้า signInWithEmailAndPassword
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password) // ใช้ฟังก์ชัน signInWithEmailAndPassword ตามรูปแบบใหม่
      .then((authUser) => {
        console.log(authUser);
        // ไปที่หน้า dashboard หรือหน้าอื่นๆ หลังจากเข้าสู่ระบบสำเร็จ
        navigate("/dashboard");
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
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
