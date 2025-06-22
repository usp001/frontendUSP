import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckUser = ({ children }) => {
  const [isTokenValid, setIsTokenValid] = useState(null);
  const navigate = useNavigate();

  const baseUrl = "https://backend-production-fc3a.up.railway.app"; // Backend API URL

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        console.log("Stored token:", token); // Debug: Check token in localStorage

        if (!token) {
          setIsTokenValid(false); // No token found
          console.log("No token found");
          navigate("/login"); // Redirect to login if no token
          return;
        }

        // Verify the token with the backend
        const response = await axios.post(
          `${baseUrl}/api/user/adminToken`,
          { token: token },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response);

        if(response.data.message == "credentials does not match") throw new Error(response.error);
        setIsTokenValid(true);
        console.log(response.data);
     
        if(response.data.role == "admin"){
            setIsTokenValid(false)
            navigate('/')
        }if(response.data.role != "admin" && response.data.role !="student"){
            setIsTokenValid(false);
            localStorage.clear('token')
        }
        localStorage.setItem("department",response.data.department)
        
        // console.log("Token verification response:", response);  // Debug: Check API response
         // Token is valid
        // if (response.data.isValid) {
        //   setIsTokenValid(true);  // Token is valid
        // } else {
        //   setIsTokenValid(false);  // Token is invalid
        //   navigate('/login');  // Redirect to login if token is invalid
        // }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsTokenValid(false); // Error while verifying token
        navigate("/login"); // Redirect to login on error
      }
    };

    checkToken();
  }, [navigate]);

  if (isTokenValid === null) {
    return <div>Loading...</div>; // Loading state while checking token
  }

  if (!isTokenValid) {
    localStorage.clear('department')
    localStorage.clear('token')
    return null; // Will redirect before rendering if token is invalid
  }

  return <>{children}</>; // Render children if token is valid
};

export default CheckUser;
