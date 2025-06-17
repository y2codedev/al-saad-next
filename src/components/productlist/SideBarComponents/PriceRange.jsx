"use client";
import React from "react";
import { useTranslations } from "next-intl";

const PriceRange = ({ price, handlePriceChange }) => {
  const t = useTranslations();
  return (
    <div className="w-full mb-4">
      <h3 className="my-2 text-[#292b2c]  price-font-bold text-xl font-roboto">
        {t("price")}
      </h3>

      <div className="flex gap-2 w-full">
        <div className="w-1/2">
          <input
            className="w-full px-3 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            value={price?.min}
            onChange={handlePriceChange}
            placeholder={t("min_price")}
            name="min"
            min="0"
            type="number"
            id="sale_low_price"
            data-gtm-form-interact-field-id="4"
          />
        </div>

        <div className="w-1/2">
          <input
            className="w-full px-3 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            value={price?.max}
            onChange={handlePriceChange}
            placeholder={t("max_price")}
            name="max"
            min="0"
            type="number"
            id="sale_high_price"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
