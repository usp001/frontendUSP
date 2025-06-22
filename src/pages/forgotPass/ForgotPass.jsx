import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages

    if (!email) {
      setError("Email is required.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true); // Show loading indicator
      const response = await axios.post("https://backend-production-fc3a.up.railway.app/api/user/sendOTP", {
        email,
      });
      setLoading(false); // Hide loading indicator

      if (response.data.message === "otpSent") {
        setSuccess("OTP sent to your email!");
        navigate("/enter-otp", { state: { email } }); // Redirect with email as state
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setLoading(false); // Hide loading indicator
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="forgotPasswordContainer">
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="forgotPasswordForm"
      >
        <Typography variant="h4" className="forgotPasswordTitle" gutterBottom>
          Forgot Password
        </Typography>
        {error && <Alert severity="error" className="forgotPasswordAlert">{error}</Alert>}
        {success && <Alert severity="success" className="forgotPasswordAlert">{success}</Alert>}
        <TextField
          label="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="darkgreen"
          className="forgot-password-button"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} background-color="green[500]" color="inherit" /> : "Send OTP"}
        </Button>
      </Box>
    </div>
  );
};

export default ForgotPassword;
