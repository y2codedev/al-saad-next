"use client";

import React, { useState, useRef } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import Dashboard from "@/components/dashboard/Dashboard";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import useUserStore from "@/store/user";
import { userService } from "@/utils/services/userServices";
import { showToast } from "@/utils/helper";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import {
  BreadCumContainer,
  BreadCumHeader,
  DashBox,
  DashTitle,
  StyledHeading,
} from "@/components/styles";
import { useTranslations } from "next-intl";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";

const MyAccount = () => {
  const { setUserInfo, userInfo } = useUserStore();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const t = useTranslations();
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
      const formData = new FormData();
      formData.append("profile_img", selectedFile);
      try {
        const response = await userService.updateProfileImage(formData);
        if (response && response.status === 200) {
          showToast("success", response.message, "success");
          const data = { ...userInfo, ...response.data };
          setUserInfo(data);
        } else {
          showToast("error", response.message, "danger");
        }
      } catch (error) {
        console.log("error in update profile:-", error);
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("dashboard")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("dashboard"), link: "dashboard" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2} mt={"10px"} mb={"50px"}>
          <Grid
            size={{
              xs: 12,
              sm: 3,
            }}
          >
            <Box
              sx={{ bgcolor: "white", boxShadow: "0 0 10px rgb(0 0 0 / 20%)" }}
            >
              <Dashboard selectItem={1} />
            </Box>
          </Grid>

          <Grid
            sx={{ mb: { sm: 0, xs: 5 } }}
            size={{
              xs: 12,
              sm: 9,
            }}
          >
            <DashBox
              sx={{ bgcolor: "white", boxShadow: "0 0 10px rgb(0 0 0 / 20%)" }}
            >
              <DashTitle sx={{ px: 2, pt: 1 }}>{t("my_account")}</DashTitle>
              <hr className=" text-gray-300 my-3" />
              <Box
                sx={{
                  p: { sm: 1, xs: 0 },
                  display: "flex",
                  alignItems: "center",
                  gap: { sm: 2, xs: 1 },
                  flexDirection: { xs: "column", sm: "row" },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <Box
                  onClick={handleIconClick}
                  sx={{
                    border: "1px solid #dee2e6",
                    borderRadius: "50%",
                    cursor: "pointer",
                    objectFit: "cover",
                    width: { sm: "130px", xs: "70px" },
                    height: { sm: "130px", xs: "70px" },
                  }}
                  component={"img"}
                  src={file ?? userInfo?.photo}
                  alt="Profile"
                  loading="lazy"
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", sm: "flex-start" },
                    gap: 1,
                  }}
                >
                  {userInfo?.name && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonOutlineOutlinedIcon />
                      <Typography
                        sx={{
                          color: "#292b2c",
                          textTransform: "capitalize",
                          fontWeight: 500,
                          cursor: "pointer",
                          fontSize: { sm: "14px", xs: "12px" },
                          ":hover": { color: "#bb1f2a" },
                        }}
                      >
                        {userInfo?.name}
                      </Typography>
                    </Box>
                  )}

                  {userInfo?.email && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MailOutlinedIcon />
                      <Typography
                        sx={{
                          color: "#292b2c",
                          textTransform: "capitalize",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: { sm: "14px", xs: "12px" },
                          ":hover": { color: "#bb1f2a" },
                        }}
                      >
                        {userInfo?.email}
                      </Typography>
                    </Box>
                  )}

                  {userInfo?.phone && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneAndroidIcon />
                      <Typography
                        sx={{
                          color: "#292b2c",
                          textTransform: "capitalize",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: { sm: "14px", xs: "12px" },
                          ":hover": { color: "#bb1f2a" },
                        }}
                      >
                        {userInfo?.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <div className="px-4 py-2">
                <CameraAltIcon
                  onClick={handleIconClick}
                  sx={{ cursor: "pointer" }}
                />
              </div>
            </DashBox>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MyAccount;
