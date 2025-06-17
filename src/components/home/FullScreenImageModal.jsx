import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

const FullScreenImageModal = ({ imageUrl, isVisible, onClose }) => {
  return (
    <Dialog
      open={isVisible}
      disableScrollLock
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "transparent",
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
          height: "100vh",
          // width
          position: "relative",
        }}
      >
        {imageUrl && (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image
              src={imageUrl}
              alt="Full Screen"
              fill={true}
              quality={100}
              className="object-contain"
            />
          </div>
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
