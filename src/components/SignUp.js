import React, { useState } from "react";
import { auth, createUserWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password) // ใช้ฟังก์ชันนี้ในการสมัครสมาชิก
      .then((authUser) => {
        console.log(authUser);
        // หลังจากสมัครสำเร็จแล้ว ไปที่หน้าล็อกอิน
        navigate("/signin");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
