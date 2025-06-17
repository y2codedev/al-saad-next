import { IconButton, CircularProgress } from "@mui/material";

const CartButton = ({ productVariantId, isLoading, isItemInCart, onClick }) => {
  let isInCart = isItemInCart(productVariantId);
  return (
    <IconButton
      sx={{
        padding: { xs: "4px", sm: "8px" },
        boxShadow: 2,
        backgroundColor: isInCart ? "#bb1f2a" : "#fff",
        "& .cart-svg-icon path": {
          fill: isInCart ? "#fff" : "#292b2c",
          transition: "fill 0.3s ease",
        },
        "&.Mui-disabled": {
          opacity: 1,
          boxShadow: 2,
        },
        ":hover": {
          backgroundColor: "#bb1f2a",
          color: "#fff",
          "& .cart-svg-icon path": {
            fill: "#fff",
            transition: "fill 0.3s ease",
          },
        },
      }}
      onClick={() => {
        if (productVariantId) {
          onClick(productVariantId);
        }
      }}
      aria-label="add to cart"
      disabled={isLoading}
    >
      {isLoading ? (
        <CircularProgress size={16} sx={{ color: "#bb1f2a" }} />
      ) : (
        <svg
          className="cart-svg-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 1024 1024"
        >
          <path
            fill="#292b2c"
            d="M1015.66 284a31.82 31.82 0 0 0-25.999-13.502h-99.744L684.78 95.666c-24.976-24.976-65.52-25.008-90.495 0L392.638 270.498h-82.096l-51.408-177.28c-20.16-69.808-68.065-77.344-87.713-77.344H34.333c-17.568 0-31.776 14.224-31.776 31.776S16.78 79.425 34.332 79.425h137.056c4.336 0 17.568 0 26.593 31.184l176.848 649.936c3.84 13.712 16.336 23.183 30.592 23.183h431.968c13.408 0 25.376-8.4 29.904-21.024l152.256-449.68c3.504-9.744 2.048-20.592-3.888-29.024zM639.537 140.93l152.032 129.584H487.457zm175.488 579.263H429.538L328.386 334.065h616.096zm-63.023 127.936c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80m-288 0c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80"
          />
        </svg>
      )}
    </IconButton>
  );
};

export default CartButton;
