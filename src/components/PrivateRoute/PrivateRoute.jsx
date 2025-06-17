"use client";

import React, { useEffect, useState } from "react";
import useUserStore from "@/store/user";
import Loading from "../Loading";
import { useRouter } from "@/i18n/navigation";

const PrivateRoute = ({ children }) => {
  const { userInfo, setUserInfo } = useUserStore();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const user = userInfo || JSON.parse(localStorage.getItem("USER") || "null");

    if (!user) {
      router.replace("/");
    } else {
      if (!userInfo) setUserInfo(user);
      setCheckingAuth(false);
    }
  }, [userInfo, router, setUserInfo]);

  if (checkingAuth) return <Loading />;

  return <>{children}</>;
};

export default PrivateRoute;
