"use client";

import ProductListingMainContant from "@/components/productlist/ProductListingMainContant";
import ProductListingMainContant2 from "@/components/productlist/ProductListingMainContant2";
export const ProductListingContent = ({ gridTogal, data }) => {
  return gridTogal ? (
    <ProductListingMainContant productsCard={data} />
  ) : (
    <ProductListingMainContant2 productsCard={data} />
  );
};
