import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const checkToken = async () => {
    console.log(token);

    if (token) {
      navigate("/user");
    }
  };
  useEffect(() => {
    checkToken();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Reset error state on new login attempt
      setError(null);

      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/user/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json", // Custom header
          },
        }
      );
      console.log(response.data.data);

      // Assuming the response contains the token
      const token = response.data.data.token;
      console.log(response.data.data.token);

      if (!token) {
        setError("Token not received from server"); // Handle the case where token is not returned
        return;
      }

      // Store the token in localStorage or sessionStorage
      localStorage.setItem("token", token);
      console.log(response.data.data.role);

      if (response.data.data.role == "student") {
        return navigate("/user");
      }
      // Redirect to the home page or any protected route
      navigate("/");
    } catch (err) {
      // Handle login failure (e.g., wrong credentials)
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <div className="forgotPassContainer">
        <a onClick={()=>{navigate('/forgotPass')}}>
          Forgot Password
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
