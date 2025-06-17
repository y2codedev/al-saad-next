"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";
import useUserStore from "@/store/user";
import { Formik } from "formik";
import * as Yup from "yup";
import { userService } from "@/utils/services/userServices";
import { showToast } from "@/utils/helper";
import COLORS from "@/utils/colors";
import styled from "styled-components";
import {
  BreadCumContainer,
  BreadCumHeader,
  DashTitle,
  StyledHeading,
} from "@/components/styles";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import Dashboard from "@/components/dashboard/Dashboard";
import MobileVerify from "@/components/MobileVerify";
import { useTranslations } from "next-intl";
import { useCountryStore } from "@/store/useCountryStore";

const StyledBox = styled(Box)`
  background: white;
  border-radius: 4px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
`;

const SaveButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  backgroundColor: COLORS.primary,
  padding: "8px 40px",
  borderRadius: "1px",
  alignSelf: "flex-end",
  display: "flex",
  justifySelf: "end",
  marginTop: "20px",
}));

const AccountDetails = () => {
  const { setUserInfo, userInfo } = useUserStore();
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await userService.profile();
        if (response?.status === 200) {
          setUserInfo({ ...userInfo, ...response.data });
        } else {
          showToast("error", response.message, "danger");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
  }, []);

  const updateProfile = async (values) => {
    try {
      const response = await userService.updateUserProfile(values);
      if (response?.status === 200) {
        showToast("success", response.message);
        setUserInfo({ ...userInfo, ...response.data });
      } else {
        showToast("error", response.message, "danger");
      }
    } catch (error) {
      console.log("error in update profile:-", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("account_details")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: "Home" },
                { text: t("account_details"), link: "" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      <Container sx={{ mt: 4, mb: { xs: 4, sm: 0 } }}>
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
              <Dashboard selectItem={4} />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 9,
            }}
          >
            <Formik
              initialValues={{
                name: userInfo?.name,
                email: userInfo?.email,
                phone: userInfo?.phone?.toString(),
                country_code: userInfo?.country_code,
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Name is required"),
                email: Yup.string()
                  .email("Invalid email")
                  .required("Email is required"),
                phone: Yup.string().required("Phone number is required"),
                country_code: Yup.string().required("Country code is required"),
              })}
              onSubmit={updateProfile}
              enableReinitialize
            >
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <StyledBox>
                  <DashTitle sx={{ px: 2, pt: 1 }}>Account Details</DashTitle>
                  <hr className=" text-gray-300 mt-1" />
                  <Grid container spacing={2} sx={{ px: 2, pt: 1 }}>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, mb: 0.5, color: COLORS.grey }}
                      >
                        {t("enter_your_name")}
                      </Typography>
                      <TextField
                        fullWidth
                        // label="Your Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        required
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, mb: 0.5, color: COLORS.grey }}
                      >
                        {t("email")}
                      </Typography>
                      <TextField
                        disabled={!!userInfo.is_email_verified}
                        fullWidth
                        // label="Enter Your Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} mt={1} sx={{ px: 2 }}>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 3,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, mb: 0.5, color: COLORS.grey }}
                      >
                        {t("country_code")}
                      </Typography>
                      <FormControl fullWidth disabled>
                        <Select
                          value={
                            userInfo?.country_code
                          }
                          sx={{ cursor: "not-allowed" }}
                        >
                          <MenuItem
                            value={
                              userInfo?.country_code
                            }
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <img
                                src={
                                  useCountryStore.getState()?.countries?.find(item => item.code == userInfo?.country_code)
                                    ?.flag
                                }
                                alt="Country Flag"
                                style={{
                                  width: 23,
                                  height: 23,
                                  marginRight: 8,
                                }}
                              />
                              <span>
                                {
                                  userInfo?.country_code
                                }
                              </span>
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 9,
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        width="100%"
                      >
                        <Box flex={1}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              mb: 0.5,
                              color: COLORS.grey,
                            }}
                          >
                            {t("mobile_number")}
                          </Typography>
                          <TextField
                            fullWidth
                            disabled
                            type="number"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            error={touched.phone && Boolean(errors.phone)}
                            helperText={touched.phone && errors.phone}
                            required
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button
                                    onClick={() => {
                                      setOpen(true);
                                    }}
                                    variant="contained"
                                    sx={{
                                      backgroundColor: COLORS.primary,
                                      height: "fit-content",
                                    }}
                                  >
                                    {userInfo.is_mobile_verified
                                      ? "Change Mobile"
                                      : "Verify"}
                                  </Button>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  <div className="py-2">
                    <SaveButton
                      variant="contained"
                      sx={{
                        backgroundColor: COLORS.primary,
                        mx: 2,
                        my: 2,
                        px: 2,
                        pb: 2,
                        height: "fit-content",
                        width: "130px",
                        alignSelf: "flex-end",
                        display: "flex",
                      }}
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </SaveButton>
                  </div>
                </StyledBox>
              )}
            </Formik>
          </Grid>
        </Grid>
        <MobileVerify open={open} onClose={() => setOpen(false)} />
      </Container>
    </Box>
  );
};

export default AccountDetails;
