"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { IoHomeOutline } from "react-icons/io5";
import { LiaGripVerticalSolid } from "react-icons/lia";
import { CiUser } from "react-icons/ci";
import { BsHandIndexThumb, BsCart3 } from "react-icons/bs";
import useCartStore from "@/store/useCartStore";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import Register from "@/auth/Register/Register";
import OtpDialog from "@/auth/Login/OtpDialog";
import Login from "@/auth/Login/Login";
import useUserStore from "@/store/user";
import { useTranslations } from "next-intl";

const BottomNav = () => {
  const { item_count } = useCartStore();
  const pathname = usePathname();
  const params = useParams();
  const [userData, setUserData] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const { userInfo } = useUserStore();
  const t = useTranslations();

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  const blockedRoutes = ["products", "smart-shoppings/details"];
  const isBlocked = blockedRoutes.some((route) => pathname.includes(route));

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile || isBlocked) return null;

  const links = [
    { to: "/", label: t("home"), icon: <IoHomeOutline size={20} /> },
    {
      to: "/category",
      label: t("category"),
      icon: <LiaGripVerticalSolid size={20} />,
    },
    {
      to: "/smart-shopping",
      label: t("smart_shopping"),
      icon: <BsHandIndexThumb size={20} />,
    },
    {
      to: "/cart",
      label: t("cart"),
      icon: <BsCart3 size={20} />,
      badge: item_count || 0,
    },
    { to: "/my-account", label: t("my_account"), icon: <CiUser size={20} /> },
  ];

  return (
    <div className="fixed bottom-[-2px] py-2 left-0 w-full flex bg-white shadow-lg z-50 overflow-hidden">
      {links?.map(({ to, label, icon, badge }) => {
        const isHome =
          to === "/" && pathname === `/${params.locale}/${params.currency}`;
        const isActive =
          to === "/"
            ? isHome
            : pathname.split("/").pop() === to.split("/").pop();
        const textColor = isActive ? "text-red-800" : "text-gray-700";

        return (
          <div key={to} className="flex-1 text-center">
            <Link
              href={to ?? "javascriptvoid(0)"}
              className="flex flex-col items-center justify-center py-2 px-1 no-underline"
              onClick={(e) => {
                const isUserLoggedIn = !!userInfo;
                if (to === "/my-account" && !isUserLoggedIn) {
                  e.preventDefault();
                  handleOpenLogin();
                }
              }}
            >
              <div className={`relative flex justify-center ${textColor}`}>
                {badge > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-700 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                    {badge}
                  </span>
                )}
                {icon}
              </div>
              <span
                className={`text-[11px] font-medium leading-tight truncate w-full ${textColor}`}
                style={{ maxWidth: "100%" }}
              >
                {label}
              </span>
            </Link>
          </div>
        );
      })}
      <Login
        open={openLogin}
        handleOpenRegister={handleOpenRegister}
        setOpenMobileOtp={handleOpenLogin}
        setOpenForgotPassword={setOpenForgotPassword}
        handleClose={handleCloseLogin}
        handleCloseRegister={handleCloseRegister}
        switchToRegister={switchToRegister}
      />
      <Register
        open={openRegister}
        handleOpenLogin={handleOpenLogin}
        switchToLogin={switchToLogin}
        handleClose={handleCloseRegister}
        handleCloseLogin={handleCloseLogin}
        handleOpenRegister={handleOpenRegister}
      />
      <ForgotPasswordModal
        open={openForgotPassword}
        handleClose={() => setOpenForgotPassword(false)}
        handleOpenLogin={handleOpenLogin}
        setOpenMobileOtp={setOpenMobileOtp}
        setUserData={setUserData}
      />
      <OtpDialog
        isDialogOpen={openMobileOtp}
        data={userData}
        handleCloseOtp={() => setOpenMobileOtp(false)}
      />
    </div>
  );
};

export default BottomNav;
