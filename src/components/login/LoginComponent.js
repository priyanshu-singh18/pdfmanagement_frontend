import React, { useEffect, useState } from "react";
import "./LoginComponent.css";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginStateAtom } from "../../context/loginState";

const getToken = async (credentials) => {
  const token = await axios.post(
    "http://localhost:8000/users/login",
    JSON.stringify(credentials),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  // console.log(token.data);
  return token.data;
};

export default function LoginComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tokenAvailable, setTokenAvailable] = useState(
    sessionStorage.getItem("token") || false
  );
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginStateAtom);

  // console.log(tokenAvailable);

  useEffect(() => {
    if (tokenAvailable) {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(username);

    const isValidPassword = password.length >= 6;

    setIsButtonDisabled(!isValidEmail || !isValidPassword);
  }, [username, password]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const email = username.toLowerCase();
      const token = await getToken({ username: email, password: password });
      sessionStorage.setItem("token", token.access);

      // setIsLoggedIn({ isLoggedIn: true, token: token.access });
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return tokenAvailable ? (
    ""
  ) : (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={formSubmitHandler} className="login">
        <label>
          <p>Email</p>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="error-message">{error}</p>}

        <div>
          <button type="submit" disabled={isButtonDisabled}>
            Login
          </button>
        </div>
      </form>
      <p>
        Dont Have an acccount?{" "}
        <a href="/signup" style={{ color: "#ab5240", textDecoration: "None" }}>
          Signup
        </a>
      </p>
    </div>
  );
}
