import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import bgImage from "../../assets/PLSPbg.jpg";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/user/change-password",
        { email, password, code: otp }
      );
      setLoading(false);

      if (response.data.message === "password changed successfully") {
        setSuccess("Password changed successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to change password. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  if (!email || !otp) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="error">
          Invalid access. Please go back and try again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "92vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 3,
          padding: 4,
          boxShadow: 4,
          backdropFilter: "blur(4px)",
          textAlign: "center",
          marginTop: "21.5vh",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ color: "green" }} gutterBottom>
          Change Password
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Please enter your new password below.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: "green",
            "&:hover": { backgroundColor: "#388e3c" },
            color: "white",
            fontWeight: "bold",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Change Password"}
        </Button>
      </Box>
    </Container>
  );
};

export default ChangePassword;
