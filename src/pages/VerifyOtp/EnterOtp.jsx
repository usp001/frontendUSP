import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import bgImage from "../../assets/PLSPbg.jpg";

const EnterOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/user/checkotp",
        { email, code: otp }
      );
      setLoading(false);

      if (response.data.message === "code matches") {
        navigate("/change-password", { state: { email, otp } });
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    }
  };

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
        alignItems: "center"
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
          marginTop:"13.5vh"
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ color: 'green' }} gutterBottom>
          Verify OTP
        </Typography>

        <Typography variant="body2" color="textSecondary" mb={2}>
          A one-time password has been sent to your email. Please enter it below to proceed.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="One-Time Password"
          variant="outlined"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
             mt: 3,
              backgroundColor: 'green',
            '&:hover': { backgroundColor: '#388e3c' },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>
    </Container>
  );
};

export default EnterOtp;
