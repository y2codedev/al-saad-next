"use client";

import React, { useState } from "react";
import {
  Box,
  List,
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { showToast } from "@/utils/helper";
import useUserStore from "@/store/user";
import { useTranslations } from "next-intl";
import { userService } from "@/utils/services/userServices";
import ConfirmationPopup from "../ConfirmationPopup";
import { useRouter } from "next/navigation";

const Dashboard = ({ selectItem }) => {
  const t = useTranslations();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      id: 1,
      text: t("dashboard"),
      icon: <GridViewOutlinedIcon />,
      path: "/my-account",
    },
    {
      id: 2,
      text: t("order_history"),
      icon: <ShoppingCartOutlinedIcon />,
      path: "/order-history",
    },
    {
      id: 3,
      text: t("my_address"),
      icon: <LocationOnOutlinedIcon />,
      path: "/my-address",
    },
    {
      id: 4,
      text: t("account_details"),
      icon: <PermIdentityOutlinedIcon />,
      path: "/account-details",
    },
    {
      id: 5,
      text: t("wishlist"),
      icon: <FavoriteBorder />,
      path: "/wishlist",
    },
    {
      id: 6,
      text: t("change_password"),
      icon: <LockOutlinedIcon />,
      path: "/change-password",
    },
    {
      id: 7,
      text: t("logout"),
      icon: <LogoutIcon />,
      path: "/",
    },
  ];

  const handleLogout = async () => {
    try {
      setOpenLogout(false);
      const response = await userService.logout();
      if (response?.status === 200) {
        router.replace("/");
        window.location.reload();
        useUserStore.getState().logout();
        showToast("success", response.message, "success");
      }
    } catch (error) {
      window.location.reload();
      useUserStore.getState().logout();
      router.push("/");
    }
  };

  const renderMenuItems = () =>
    menuItems?.map((item) => (
      <Box
        key={item?.id}
        component={"div"}
        href={"javascript:void(0)"}
        onClick={() => {
          setOpen(false);
          setTimeout(() => {
            if (item?.text !== "Logout") {
              router.push(item.path);
              return;
            } else {
              setOpenLogout(true);
            }
          }, 300);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: selectItem === item?.id ? "#bb1f2a" : "#fff",
          color: selectItem === item?.id ? "#fff" : "#2b2f4c",
          ":hover": {
            bgcolor: "#bb1f2a",
            color: "#fff",
          },
          cursor: "pointer",
          whiteSpace: "nowrap",
          px: 2,
          py: 1,
          my: 1,
        }}
      >
        <Box
          sx={{
            color: "inherit",
            minWidth: "30px !important",
          }}
        >
          {item?.icon}
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontSize: "16px",
            textTransform: "capitalize",
            fontWeight: "500",
          }}
        >
          {item?.text}
        </Typography>
      </Box>
    ));

  const handleToggleModal = () => setOpen(!open);

  return (
    <Box>
      {isXs && (
        <IconButton onClick={handleToggleModal} sx={{ margin: "10px" }}>
          <MenuIcon fontSize="large" />
        </IconButton>
      )}

      <Dialog fullScreen={isXs} open={open} onClose={handleToggleModal}>
        <DialogContent
          sx={{
            position: "relative",
            padding: "50px 16px",
            maxHeight: "100vh",
            overflowY: "scroll",
          }}
        >
          <IconButton
            onClick={handleToggleModal}
            sx={{ position: "absolute", right: 2, top: 2 }}
          >
            <CloseIcon />
          </IconButton>
          <List>{renderMenuItems()}</List>
        </DialogContent>
      </Dialog>

      {!isXs && (
        <Box>
          <List>{renderMenuItems()}</List>
        </Box>
      )}

      <ConfirmationPopup
        open={openLogout}
        handleClose={() => setOpenLogout(false)}
        handleConfirm={handleLogout}
        title="Logout ?"
        subtitle="Are you sure you want to log out?"
        confirmText="Log out"
        isIcon={false}
      />
    </Box>
  );
};

export default Dashboard;
