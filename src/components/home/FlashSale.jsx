"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@mui/material";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const FlashSale = ({ flashSale, isLoading }) => {
  const params = useParams();
  const [timers, setTimers] = useState([]);
  const t = useTranslations();
  const saudiTimeOffset = -2 * 45 * 60 * 1000;

  const calculateTimeLeft = (endDate) => {
    const saudiTime = new Date(new Date().getTime() + saudiTimeOffset);
    const end = new Date(endDate).getTime();
    const distance = end - saudiTime.getTime();

    if (distance > 0) {
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  useEffect(() => {
    if (!flashSale) {
      return;
    }
    const interval = setInterval(() => {
      const updatedTimers = flashSale.map((item) =>
        calculateTimeLeft(item.end_date),
      );
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSale]);

  const memoizedTimers = useMemo(() => timers, [timers]);

  return (
    <Container maxWidth="lg" sx={{ padding: 1 }}>
      <h2 className="text-xl sm:text-2xl font-semibold mb-1 capitalize text-left">
        {t("flash_sale")}
      </h2>
      <hr className="mb-4 border-t border-gray-300" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {flashSale.length > 0 &&
          flashSale?.map((item, index) => (
            <div key={item?.id} className="w-full">
              <Link
                locale={params.locale}
                href={`/search/flash_sale/${item?.id}`}
                className="block no-underline"
              >
                <div className="relative shadow-md overflow-hidden cursor-pointer">
                  <div className="relative w-full h-[200px]">
                    <Image
                      src={item?.image}
                      alt={item?.banner_name}
                      fill={true}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-7 w-full text-white flex justify-center items-center gap-1">
                    <span className="bg-red-700 px-2 py-1 font-semibold text-xs">
                      {String(memoizedTimers[index]?.days || 0).padStart(
                        2,
                        "0",
                      )}{" "}
                      D
                    </span>
                    <span className="bg-red-700 px-2 py-1 font-semibold text-xs">
                      {String(memoizedTimers[index]?.hours || 0).padStart(
                        2,
                        "0",
                      )}{" "}
                      H
                    </span>
                    <span className="bg-red-700 px-2 py-1 font-semibold text-xs">
                      {String(memoizedTimers[index]?.minutes || 0).padStart(
                        2,
                        "0",
                      )}{" "}
                      M
                    </span>
                    <span className="bg-red-700 px-2 py-1 font-semibold text-xs">
                      {String(memoizedTimers[index]?.seconds || 0).padStart(
                        2,
                        "0",
                      )}{" "}
                      S
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default React.memo(FlashSale);
