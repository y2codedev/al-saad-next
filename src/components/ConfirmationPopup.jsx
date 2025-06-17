"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Fade,
  Typography,
  Box,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const ConfirmationPopup = ({
  open,
  handleClose,
  handleConfirm,
  title,
  subtitle,
  cancelText = "Cancel",
  confirmText = "Confirm",
  isIcon = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
      keepMounted
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="xs"
      fullWidth
      disableScrollLock
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isIcon && (
          <WarningIcon
            sx={{ color: "#ff9800", my: 1, height: 30, width: 30 }}
          />
        )}
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body1"
            sx={{ textAlign: "center", marginBottom: 2 }}
          >
            {subtitle}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                px: 3,
                color: "#bb1f2a",
                borderColor: "#bb1f2a",
                borderRadius: "0px",
              }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              sx={{ background: "#bb1f2a", px: 3, borderRadius: "0px" }}
            >
              {confirmText}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationPopup;
