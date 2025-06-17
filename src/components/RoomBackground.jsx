"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Image from "next/image";

const RoomBackground = ({ open, data, selectedPhotos, onClose, onApply }) => {
  const [selectionStore, setSelectionStore] = useState(selectedPhotos);

  const handleSelection = (engagementIndex, photoId, action = "select") => {
    setSelectionStore((prevStore) => ({
      ...prevStore,
      [engagementIndex]: action === "remove" ? null : photoId,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      disableScrollLock
      sx={{
        maxHeight: "90vh",
        "& .MuiDialog-container": {
          alignItems: "center",
        },
      }}
      PaperProps={{ sx: { mt: "100px", verticalAlign: "center" } }}
    >
      <DialogTitle>Change Room Backgrounds</DialogTitle>
      <DialogContent dividers>
        {data &&
          data?.map((item, idx) => (
            <Box key={item.id} sx={{ marginBottom: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                {item.title}
              </Typography>
              <Grid container spacing={2}>
                {item.photos.map((photo) => (
                  <Grid
                    key={photo.id}
                    size={{
                      xs: 6,
                      sm: 4,
                      md: 3,
                    }}
                  >
                    <Card
                      sx={{
                        border:
                          selectionStore[idx] === photo.image
                            ? "1px solid #bb1f2a"
                            : "1px solid transparent",
                        position: "relative",
                      }}
                      onClick={() =>
                        handleSelection(idx, photo.image, "select")
                      }
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "100px",
                        }}
                      >
                        <Image
                          src={photo.thumb}
                          alt="Photo"
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="100vw"
                        />
                      </Box>
                      <CardContent>
                        <Typography variant="body2" textAlign="center">
                          {photo.title}
                        </Typography>
                      </CardContent>

                      {selectionStore[idx] === photo.image && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelection(idx, photo.image, "remove");
                          }}
                          sx={{
                            p: 0.1,
                            position: "absolute",
                            top: 0,
                            right: 0,
                            color: "white",
                            backgroundColor: "#bb1f2a",
                            borderRadius: "50%",
                            zIndex: 1,
                            m: 0.5,
                            boxShadow: 1,
                            ":hover": {
                              backgroundColor: "#bb1f2a",
                            },
                          }}
                        >
                          <CloseIcon fontSize="small" sx={{ color: "white" }} />
                        </IconButton>
                      )}
                    </Card>

                    <IconButton
                      onClick={onClose}
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        backgroundColor: "white",
                        borderRadius: "50%",
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#bb1f2a",
            color: "white",
            borderRadius: "0px",
            minWidth: "114px",
            mx: 4,
          }}
          onClick={() => {
            if (selectionStore) onApply(selectionStore);
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomBackground;
