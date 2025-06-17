import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

const MobileAddCartBox = ({
  selectedProductInfo,
  selectedCountry,
  selectedQuantity,
  isOutOfStock,
  isLoading,
  addToCart,
  inCart,
  className,
  t,
}) => {
  if (!selectedProductInfo?.quantity) return null;
  return (
    <div className={className ??  "flex sm:hidden items-center mt-3 p-2 justify-between fixed bottom-[-2px] left-0 w-full bg-[rgb(255,255,255)] z-[999] shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] rounded-tl-xl rounded-tr-xl"}>
      <div>
        <div className="flex items-center gap-1 flex-wrap ">
          <span className="text-[#bb1f2a] font-semibold text-[13px] sm:text-[18px] flex-wrap">
            {selectedProductInfo?.sale_price > 0
              ? selectedProductInfo?.sale_price
              : selectedProductInfo?.list_price}{" "}
            {selectedCountry?.currency_code}
          </span>

          {selectedProductInfo?.sale_price > 0 && (
            <span className="line-through text-[#687188] text-[13px] sm:text-[15px] flex-wrap">
              {selectedProductInfo?.list_price} {selectedCountry?.currency_code}
            </span>
          )}

          {selectedProductInfo?.discount_label && (
            <span className="text-green-600 text-[13px] sm:text-[12px] flex-wrap">
              {selectedProductInfo?.discount_label}
            </span>
          )}
        </div>

        <span className="text-[#687188] text-[13px] sm:text-[15px] flex-wrap">
          ({t("price_include")})
        </span>
      </div>

      {/* Add to Cart */}
      <Button
        variant="contained"
        sx={{
          fontSize: "12px",
          color: "#fff",
          minWidth: 160,
          py: 1,
          px: 1,
          borderRadius: 1,
          boxShadow: "none",
          backgroundColor: isOutOfStock || isLoading ? "#d1d5db" : "#bb1f2a",
          cursor: isOutOfStock || isLoading ? "not-allowed" : "pointer",
          "&:hover": {
            backgroundColor: isOutOfStock || isLoading ? "#d1d5db" : "#a11b24",
          },
        }}
        disabled={isOutOfStock || isLoading}
        onClick={addToCart}
      >
        {isLoading ? (
          <CircularProgress size={14} sx={{ color: "#fff", mr: 1 }} />
        ) : (
          <svg
            className="mx-1.5"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="#fff"
              d="M1015.66 284a31.82 31.82 0 0 0-25.999-13.502h-99.744L684.78 95.666c-24.976-24.976-65.52-25.008-90.495 0L392.638 270.498h-82.096l-51.408-177.28c-20.16-69.808-68.065-77.344-87.713-77.344H34.333c-17.568 0-31.776 14.224-31.776 31.776S16.78 79.425 34.332 79.425h137.056c4.336 0 17.568 0 26.593 31.184l176.848 649.936c3.84 13.712 16.336 23.183 30.592 23.183h431.968c13.408 0 25.376-8.4 29.904-21.024l152.256-449.68c3.504-9.744 2.048-20.592-3.888-29.024zM639.537 140.93l152.032 129.584H487.457zm175.488 579.263H429.538L328.386 334.065h616.096zm-63.023 127.936c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80m-288 0c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80"
            />
          </svg>
        )}
        {inCart ? t("go_to_cart") : t("add_to_cart")}
      </Button>
    </div>
  );
};

export default MobileAddCartBox;
