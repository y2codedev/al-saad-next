import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const MobileInstallBanner = () => {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-between px-2 py-[8px] bg-[rgba(0,0,0,0.6)] h-[50px] sm:hidden">
      <div className="flex items-center gap-2">
        <img
          src="https://play-lh.googleusercontent.com/2nI3xPyOkPspG9v7gRKiQhn3uT6xF6nXP2xDCrfBNin1jstDZhQmWHOnbgrkmCtpLVs=w240-h480-rw"
          alt="Al Saad Home App"
          className="w-6 h-6 object-contain"
        />
        <div className="leading-tight text-white">
          <div className="font-bold text-[11px]">
           {t("download_app")}<br /> {t("download_app_description")}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://alsaadhome.page.link/JtSb"
          className="bg-white text-red-600 px-2 py-[2px] text-xs rounded hover:bg-gray-100 transition"
        >
          <p className="text-red-600">{t("try_now")}</p>

        </a>
        <button
          className="text-white hover:text-red-400 transition"
          onClick={() => setIsVisible(false)}
        >
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  );
};

export default MobileInstallBanner;
