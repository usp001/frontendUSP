import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";

export default function PositionedSnackbar({
  open,
  message,
  onClose,
  bgColor,
}) {
  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={onClose}
        message={message}
        sx={{
          // Preventing Snackbar's default background color from interfering
          backgroundColor: "transparent", // Making the background transparent
        }}
      >
        <SnackbarContent
          message={message}
          sx={{
            backgroundColor: bgColor || "green", // Applying custom background color
            color: "white", // Text color
          }}
        />
      </Snackbar>
    </Box>
  );
}
