"use client";

import { Box, Fade, Modal, IconButton, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ProductListingSideBar from "./ProductListingSideBar";
export const ModalFilter = ({ isModalOpen, handleCloseModal }) => {
  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={isModalOpen}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
            boxShadow: 24,
            px: 2,
            py: 1,
            outline: 0,
            borderRadius: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ alignSelf: "flex-end", mb: 2 }}
          >
            <CloseIcon />
          </IconButton>
          <ProductListingSideBar />
        </Box>
      </Fade>
    </Modal>
  );
};
