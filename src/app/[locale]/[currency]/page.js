"use client";

import React, { useCallback, useEffect } from "react";
import TopSlider from "@/components/home/TopSlider";
import BannderSlider from "@/components/home/BannderSlider";
import FeatureBrandsSlider from "@/components/home/FeatureBrandsSlider";
import DealsSlider from "@/components/home/DealsSlider";
import FlashSale from "@/components/home/FlashSale";
import FlashSaleSlider from "@/components/home/FlashSaleSlider";
import BannerSection from "@/components/home/BannerSection";
import Products from "@/components/Products";
import useHomeStore from "@/store/useHomeStore";
import GridProduts from "@/components/home/GridProduts";
import useCartStore from "@/store/useCartStore";
import BlogCard from "@/components/home/BlogCard";
import AppSlider from "@/components/AppSlider";
import { useParams } from "next/navigation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { shallow } from "zustand/shallow";

export default function Home() {
  const { addToCart } = useCartStore();
  const params = useParams()
  const { language } = useLanguageStore()
  const { data, getRec, getNewPro, getGrid, isLoading, fetchAllData } = useHomeStore();

  useEffect(() => {
    fetchAllData()
  }, []);

  return (
    <div className="min-vh-100 w-full mb-[70px] sm:mb-0">
      <>
        <TopSlider topSlider={data?.category || []} isLoading={isLoading} />
        <BannderSlider
          BannderSliderData={data?.slider || []}
          isLoading={isLoading}
        />
        <FeatureBrandsSlider
          FeaturedBrands={data?.featured_brands || []}
          isLoading={isLoading}
        />
        <DealsSlider
          DealsSlider={data?.display_banners}
          isLoading={isLoading}
        />
        {data?.flash_sale && data?.flash_sale?.length > 0 && (
          <FlashSale flashSale={data?.flash_sale || []} isLoading={isLoading} />
        )}
        <BannerSection
          bannerSection={data?.banner || []}
          isLoading={isLoading}
        />
        <AppSlider
          productsCard={getNewPro || []}
          isLoading={isLoading}
          title={"new_arrival"}
          viewHref={`/search/new`}
        />
        <GridProduts item={getGrid} />
        {data?.grid_product && <Products products={data?.grid_product} />}
        {data?.banner && (
          <BannerSection
            bannerSection={data?.banner || []}
            isLoading={isLoading}
          />
        )}

        {getRec && (
          <AppSlider
            productsCard={getRec || []}
            isLoading={isLoading}
            title={"recommended"}
            viewHref={`/search/new`}
          />
        )}
        {data?.flash_sale_products &&
          data?.flash_sale_products?.map((item, index) => (
            <FlashSaleSlider
              isLoading={isLoading}
              key={index}
              item={item}
              addToCart={addToCart}
            />
          ))}
        <BlogCard />
      </>
    </div>
  );
}
