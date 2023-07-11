import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupComponent.css";

export default function SignupComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cnfpassword, setCnfpassword] = useState();
  const [fullname, setFullname] = useState("");
  const [error, setError] = useState();

  const getToken = async (credentials) => {
    try {
      const token = await axios.post(
        "http://localhost:8000/users/signup",
        JSON.stringify(credentials),
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      // console.log(token.data);
      return token.data;
    } catch (error) {
      if (error.response) {
        // console.log(error.response);
        const { status, data } = error.response;
        setError(`Error signing up (${status}): ${data.error}`);
      } else if (error.request) {
        setError("No response received from the server. Please try again.");
      } else {
        setError("An error occurred while signing up. Please try again.");
      }
    }
  };

  const navigate = useNavigate();

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const email = username.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);

    if (fullname === "") {
      setError("Enter Full Name Please");
      return;
    }
    if (email === "" && !isValidEmail) {
      setError("Enter Email Please");
      return;
    }
    if (password.length <= 6) {
      setError("Password too short");
      return;
    }
    if (password !== cnfpassword) {
      setError("Passwords Don't Match! Try Again");
      return;
    }
    try {
      const token = await getToken({
        name: fullname,
        username: email,
        password: password,
      });
      sessionStorage.setItem("token", token.Token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Invalid username or password");
    }
  };

  return (
    <>
      <form onSubmit={formSubmitHandler} className="signup-form">
        <h1>Signup</h1>
        <label>
          <p>Full Name</p>
          <input
            type="text"
            value={fullname}
            onChange={(e) => {
              setFullname(e.target.value);
              setError("");
            }}
          />
        </label>
        <label>
          <p>Email</p>
          <input
            type="email"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
          />
        </label>

        <label>
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
        </label>
        <label>
          <p>Confirm Password</p>
          <input
            type="password"
            value={cnfpassword}
            onChange={(e) => {
              setCnfpassword(e.target.value);
              setError("");
            }}
          />
        </label>
        {error && <p className="error-message">{error}</p>}

        <div>
          <button type="submit">Signup</button>
        </div>
      </form>
    </>
  );
}
