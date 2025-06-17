"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FullScreenImageModal = ({ imageUrl, isVisible, onClose }) => {
  return (
    <Dialog
      open={isVisible}
      disableScrollLock
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "black",
          boxShadow: "none",
          borderRadius: 0,
        },
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Full Screen"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ position: "absolute", top: 0, right: 0 }}>
        <IconButton
          onClick={onClose}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <CloseIcon style={{ color: "white" }} />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default FullScreenImageModal;
