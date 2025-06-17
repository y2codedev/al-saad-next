import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { MdOutlineShoppingCart } from "react-icons/md";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const AddToCartActions = () => (
  <Box
    sx={{
      display: "flex",
      gap: 2,
      alignItems: "center",
      marginTop: "16px",
    }}
  >
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#bb1f2a",
        color: "#fff",
        display: "flex",
        gap: 1,
        alignItems: "center",
      }}
    >
      Add to Cart <MdOutlineShoppingCart size={20} />
    </Button>
    <IconButton
      aria-label="add to favorites"
      sx={{
        ":hover": { color: "#bb1f2a" },
        borderRadius: "50%",
        backgroundColor: "#eee",
      }}
    >
      <FavoriteBorderIcon />
    </IconButton>
  </Box>
);

export default AddToCartActions;
