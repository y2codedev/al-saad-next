import React from "react";
import { IconButton } from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

const WishlistButton = ({
  isLoggedIn,
  productId,
  variantId,
  isItemInWishlist,
  toggleWishlist,
  handleOpenLogin,
  sx = {},
}) => {
  const isInWishlist = isItemInWishlist(variantId);

  return (
    <IconButton
      sx={{
        boxShadow: 2,
        padding: { xs: "4px", sm: "8px" },
        backgroundColor: isInWishlist ? "#bb1f2a" : "white",
        "& .MuiSvgIcon-root": {
          fill: isInWishlist ? "#fff" : "#292b2c",
        },
        "&:hover": {
          backgroundColor: "#bb1f2a",
          color: "#fff !important",
          "& .MuiSvgIcon-root": {
            fill: "#fff",
          },
        },
        ...sx,
      }}
      onClick={() => {
        isLoggedIn ? toggleWishlist(productId, variantId) : handleOpenLogin();
      }}
      aria-label="add to wishlist"
    >
      <FavoriteBorder sx={{ fontSize: "1rem" }} />
    </IconButton>
  );
};

export default WishlistButton;
