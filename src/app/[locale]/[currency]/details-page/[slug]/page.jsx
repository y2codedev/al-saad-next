"use client";

import React, { useState } from "react";
import OptimizedImage from "@/components/product-details-page/OptimizedImage";
import PaymentMethods from "@/components/product-details-page/PaymentMethods";
import parse from "html-react-parser";
import { useProductDetails } from "@/hooks/useProductDetails";
import ColorSwatch from "@/components/product-details-page/ColorSwatch";
import PatternSwatch from "@/components/product-details-page/PatternSwatch";
import AddToCartModal from "@/components/product-details-page/AddToCartModal";
import ReviewPredoctDetails from "@/components/product-details-page/ReviewPredoctDetails";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useCartStore from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/store/useSettingsStore";

const HeroSections = () => {
  const params = useParams();
  const { selectedCountry } = useSettingsStore();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const variantId = searchParams.get("variant_id");
  const {
    isItemInCart,
    loadingVariants,
  } = useCartStore();


  let customerId = null;
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("USER") || "{}");
    customerId = user?.id;
  }

  const {
    loading,
    selectedImage,
    setSelectedImage,
    selectedProductInfo,
    productData,
    sizes,
    details,
  } = useProductDetails(productId, variantId, customerId);

  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageSelect = (img) => {
    setSelectedImage(img);
  };

  const handleColorChange = (variantId, productId, slug) => {
    const newUrl = `/${params.locale}/${params.currency}/products/${slug}?product_id=${productId}&variant_id=${variantId}`;
    window.history.replaceState(null, "", newUrl);
  };

  const isLoading = loadingVariants?.[selectedProductInfo?.variant_id];
  const isOutOfStock = selectedProductInfo?.quantity === 0;
  const inCart = isItemInCart(selectedProductInfo?.variant_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10  border-b-2 border-[#bb1f2a]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="relative w-full min-h-screen">
          <OptimizedImage
            src={selectedImage}
            alt="slider image"
            fill
            loading="eager"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 -mt-20 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl - md:text-4xl text-white font-bold">
              {selectedProductInfo?.title}
            </h2>
            {/* {selectedProductInfo?.description && (
              <p className="text-sm hidden md:block text-white mt-0 mb-2 max-w-2xl line-clamp-2 ">
                {parse(selectedProductInfo?.description)}
              </p>
            )} */}
          </div>
        </div>

        <nav className="absolute bottom-18 left-1/2 transform -translate-x-1/2 z-30 bg-black/40 sm:px-4 px-2 py-3 rounded-md backdrop-blur-md shadow-md w-[97vw] sm:w-1/2">
          <div className="flex justify-between items-center mb-4 gap-4">
            <div className="w-1/2">
              <span className="text-sm pb-2  text-white block">{t("image")}</span>
              <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 whitespace-nowrap max-w-[260px] sm:max-w-[260px]">
                {selectedProductInfo?.photo.slice(0, 3)?.map((item) => (
                  <div
                    key={item?.id}
                    onClick={() => handleImageSelect(item?.src)}
                    className={`w-[30px] h-[30px] sm:w-[60px] sm:h-[60px]
                  md:w-[30px] md:h-[30px] lg:w-[60px] lg:h-[60px] xl:w-[60px]
                   xl:h-[60px] 2xl:w-[60px] 2xl:h-[60px] cursor-pointer flex
                  items-center justify-center rounded border-2 overflow-hidden
                  transition
                   ${selectedImage === item.src ? "border-[#bb1f2a]" : "border-white"}
                `}
                  >
                    <OptimizedImage
                      src={item?.src}
                      alt={`Thumbnail`}
                      width={60}
                      height={60}
                      loading="lazy"
                      className="object-cover h-full w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2  ">
              {productData?.some((item) => item?.pattern?.variant_id)
                ? <span className="text-sm text-white">{t("pattern")}</span>
                : <span className="text-sm text-white">{t("color")}</span>
              }
              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                {productData?.map((variantItemInfo, index) => {
                  const { pattern, colors, sizes, items } = variantItemInfo;
                  const variantIds = [
                    pattern?.variant_id,
                    colors?.variant_id,
                    ...(sizes?.map((size) => size?.variant_id) || []),
                  ];
                  const isActive = variantIds.includes(
                    selectedProductInfo?.variant_id?.toString(),
                  );

                  const handleClick = (variantId) => {
                    const variant = items?.find((v) => v?.variant_id == variantId);
                    if (variantId && variant) {
                      handleColorChange(variantId, productId, variant?.slug);
                    }
                  };

                  if (pattern?.variant_id) {
                    return (
                      <PatternSwatch
                        key={`pattern-${index}`}
                        isActive={isActive}
                        image={pattern?.image}
                        onClick={() => handleClick(pattern?.variant_id)}
                        index={index}
                      />
                    );
                  }

                  if (colors?.all_colors?.length > 0) {
                    const colorsData = colors.all_colors;
                    const slice = 100 / colorsData.length;
                    const background = `conic-gradient(${colorsData
                      .map(
                        (color, i) => `${color} ${i * slice}% ${(i + 1) * slice}%`,
                      )
                      .join(", ")})`;

                    return (
                      <ColorSwatch
                        key={`color-${index}`}
                        isActive={isActive}
                        background={background}
                        onClick={() => handleClick(colors?.variant_id)}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          <div className="my-4 flex justify-center">
            <button
              disabled={isOutOfStock || isLoading}
              onClick={() => {
                inCart
                  ? router.push("/cart")
                  : setModalOpen(true)
              }}
              className={`w-full py-2 px-6 text-xs rounded text-black font-semibold gap-2 flex items-center justify-center shadow-none ${isOutOfStock || isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200"
                }`}
            >
              <span>{selectedProductInfo && selectedProductInfo?.list_price}  {selectedCountry?.currency_code} </span>
              {inCart ? t("go_to_cart") : t("add_to_cart")} 
            </button>
            {/* <Button
              variant="custom"
              label="Add to Cart"
              price={selectedProductInfo && selectedProductInfo?.list_price}
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 font-semibold py-3 w-full text-2xlsm bg-gray-200 text-black rounded hover:bg-gray-300"
            /> */}
          </div>
          <PaymentMethods />
        </nav>

        <AddToCartModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedProductInfo={selectedProductInfo}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          productData={productData}
          sizes={sizes}
          details={details}
          loading={loading}
        />
      </div>

      <ReviewPredoctDetails
        productId={productId}
        variantId={variantId}
      />

    </>
  );
};

export default HeroSections;