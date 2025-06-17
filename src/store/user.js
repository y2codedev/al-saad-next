import { create } from "zustand";

const getUserFromStorage = () => {
  if (typeof window !== "undefined" && localStorage.getItem("USER")) {
    const storedUser = localStorage.getItem("USER");
    return storedUser ? JSON.parse(storedUser) : null;
  }
  return null;
};

const useUserStore = create((set) => ({
  isLoggedIn: !!getUserFromStorage(),
  userInfo: getUserFromStorage(),
  loginToken: getUserFromStorage()?.token || "",

  setUserInfo: (userInfo) => {
    set(() => ({
      userInfo,
      isLoggedIn: true,
      loginToken: userInfo.token,
    }));
    if (typeof window !== "undefined" && userInfo) {
      localStorage.setItem("USER", JSON.stringify(userInfo));
    }
  },

  logout: () => {
    set(() => ({
      userInfo: null,
      isLoggedIn: false,
      loginToken: "",
    }));
    if (typeof window !== "undefined" && localStorage.getItem("USER")) {
      localStorage.removeItem("USER");
      localStorage.removeItem("cart_id");
      sessionStorage.removeItem("mobile_verification_skipped");
    }
  },
}));

export default useUserStore;
