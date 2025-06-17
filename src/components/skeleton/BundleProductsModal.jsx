import React from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  Card,
  CardContent,
  IconButton,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCartStore from "@/store/useCartStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";

const BundleProductsModal = ({ bundleProduct, open, handleClose }) => {
  const { isItemInCart, addToCart } = useCartStore();
  const { selectedCountry } = useSettingsStore;
  const navigate = useRouter();

  return (
    <div>
      <Box sx={{ overflow: "hidden" }}>
        <Modal
          sx={{
            overflow: "hidden",
          }}
          disableScrollLock
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
        >
          <div className="max-w-3xl mx-auto overflow-y-auto max-h-screen p-4">
            <div className="bg-white rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center  top-0 bg-white z-10">
                <h2 className="text-lg font-semibold">Bundle Products</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-600 cursor-pointer"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto pt-2">
                {bundleProduct?.length > 0 &&
                  bundleProduct.map((product, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center shadow rounded-md overflow-hidden"
                    >
                      <div className="relative w-full sm:w-[100px] md:w-[200px] h-[120px] sm:h-[150px] md:h-[200px] flex-shrink-0 overflow-hidden">
                        <Image
                          src={product?.image}
                          alt={product?.title || "Product Image"}
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row flex-1 w-full">
                        <div className="p-3 flex-1 text-left">
                          <p className="text-sm sm:text-base font-medium">
                            {product?.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-red-600 font-semibold text-lg">
                              {product?.sale_price > 0
                                ? product?.sale_price
                                : product?.list_price}{" "}
                              {selectedCountry?.currency_code}
                            </span>

                            {product?.sale_price > 0 && (
                              <span className="text-gray-500 line-through text-sm">
                                {product?.list_price}{" "}
                                {selectedCountry?.currency_code}
                              </span>
                            )}

                            {product?.discount_label && (
                              <span className="text-green-600 text-sm">
                                {product?.discount_label}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end px-3  pb-2 sm:pt-30">
                          <button
                            onClick={() => {
                              if (product?.product_variant_id) {
                                if (
                                  !isItemInCart(product?.product_variant_id)
                                ) {
                                  addToCart(product?.product_variant_id);
                                } else {
                                  navigate.push("/cart");
                                }
                              }
                            }}
                            className="bg-red-700 hover:bg-red-800 text-white text-sm font-medium px-3 py-2 rounded-md flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4 fill-white"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 1024 1024"
                            >
                              <path d="M1015.66 284a31.82 31.82 0 0 0-25.999-13.502h-99.744L684.78 95.666c-24.976-24.976-65.52-25.008-90.495 0L392.638 270.498h-82.096l-51.408-177.28c-20.16-69.808-68.065-77.344-87.713-77.344H34.333c-17.568 0-31.776 14.224-31.776 31.776S16.78 79.425 34.332 79.425h137.056c4.336 0 17.568 0 26.593 31.184l176.848 649.936c3.84 13.712 16.336 23.183 30.592 23.183h431.968c13.408 0 25.376-8.4 29.904-21.024l152.256-449.68c3.504-9.744 2.048-20.592-3.888-29.024zM639.537 140.93l152.032 129.584H487.457zm175.488 579.263H429.538L328.386 334.065h616.096zm-63.023 127.936c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80m-288 0c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80" />
                            </svg>
                            {isItemInCart(product?.product_variant_id)
                              ? "Go to Cart"
                              : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Modal>
      </Box>
    </div>
  );
};

export default BundleProductsModal;
