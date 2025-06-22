import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

const PdfViewer = ({ open, handleClose, row }) => {
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    if (row && open) {
      fetchPdf(row.id);
    }
  }, [row, open]);

  const fetchPdf = async (id) => {
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/ar/viewPdf",
        { id },
        {
          headers: {
            "Content-Type": "application/json", // Custom header
          },
        }
      );

      // Check if PDF data is received
      if (response.data.message === "pdf located" && response.data.data) {
        const bufferData = new Uint8Array(response.data.data.data); // Access the buffer
        const blob = new Blob([bufferData], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(blob);

        setPdfData(pdfUrl);
      } else {
        alert("Failed to fetch PDF");
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      alert("An error occurred while fetching the PDF.");
    }
  };

  useEffect(() => {
    return () => {
      if (pdfData) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [pdfData]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="pdf-viewer-title"
      aria-describedby="pdf-viewer-description"
    >
      <Box sx={modalStyle}>
        <h2 id="pdf-viewer-title">PDF Viewer</h2>
        <p id="pdf-viewer-description">
          Viewing PDF document: {row?.title || "Unknown"}
        </p>
        {pdfData ? (
          <iframe
            src={pdfData}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="PDF Viewer"
          />
        ) : (
          <p>Loading PDF...</p>
        )}
      </Box>
    </Modal>
  );
};

export default PdfViewer;
