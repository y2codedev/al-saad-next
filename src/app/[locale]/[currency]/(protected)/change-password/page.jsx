"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import Dashboard from "@/components/dashboard/Dashboard";
import { userService } from "@/utils/services/userServices";
import useUserStore from "@/store/user";
import * as Yup from "yup";
import { showToast } from "@/utils/helper";
import { Formik } from "formik";
import {
  BreadCumContainer,
  BreadCumHeader,
  DashBox,
  DashTitle,
  StyledHeading,
} from "@/components/styles";
import COLORS from "@/utils/colors";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import { useTranslations } from "next-intl";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const validationSchema = Yup.object({
    old_password: Yup.string()
      .min(6, "Old Password must be at least 6 characters long")
      .required("Old password is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const handlePasswordChange = async (value, { resetForm }) => {
    const request = {
      user_id: useUserStore.getState().userInfo.id,
      old_password: value.old_password,
      password: value.password,
      confirm_password: value.confirm_password,
    };
    try {
      setLoading(true);
      const response = await userService.changePassword(request);

      if (response && response.status === 200) {
        showToast("success", response.message);
        resetForm();
      } else {
        showToast("error", response.message);
      }
    } catch (error) {
      const errorMessage = error?.message || "Something went wrong!";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("change_password")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "", text: t("home") },
                { text: t("change_password"), link: "change-password" },
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
              <Dashboard selectItem={6} />
            </Box>
          </Grid>

          <Grid
            sx={{ mb: { sm: 0, xs: 5 } }}
            size={{
              xs: 12,
              sm: 9,
            }}
          >
            <DashBox>
              <DashTitle sx={{ px: 2, pt: 1 }}>{t("change_password")}</DashTitle>
              <hr className=" text-gray-300 my-3" />
              <Formik
                initialValues={{
                  old_password: "",
                  password: "",
                  confirm_password: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(value, { resetForm }) =>
                  handlePasswordChange(value, { resetForm })
                }
              >
                {({
                  handleChange,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  isValid,
                  resetForm,
                }) => {
                  return (
                    <Box sx={{ px: 2, pb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: COLORS.grey }}
                      >
                        {t("old_password")}
                      </Typography>
                      <TextField
                        sx={{ mb: 1.5, mt: "5px !important" }}
                        fullWidth
                        placeholder={t("old_password")}
                        name="old_password"
                        value={values.old_password}
                        onChange={handleChange}
                        error={
                          touched.old_password && Boolean(touched.old_password)
                        }
                        helperText={touched.old_password && errors.old_password}
                        required
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: COLORS.grey }}
                      >
                        {t("password")}
                      </Typography>
                      <TextField
                        sx={{ mb: 1.5, mt: "5px !important" }}
                        fullWidth
                        placeholder={t("password")}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        error={touched.password && Boolean(touched.password)}
                        helperText={touched.password && errors.password}
                        required
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: COLORS.grey }}
                      >
                        {t("confrim_password")}
                      </Typography>
                      <TextField
                        sx={{ mb: 1.5, mt: "5px !important" }}
                        fullWidth
                        placeholder={t("confrim_password")}
                        name="confirm_password"
                        value={values.confirm_password}
                        onChange={handleChange}
                        error={
                          touched.confirm_password &&
                          Boolean(touched.confirm_password)
                        }
                        helperText={
                          touched.confirm_password && errors.confirm_password
                        }
                        required
                      />
                      <Button
                        disabled={!isValid || loading}
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                          color: "#fff",
                          backgroundColor: "#bb1f2a",
                          py: 1,
                          px: 7,
                          borderRadius: "2px",
                          display: "flex",
                        }}
                      >
                        {t("save")}
                      </Button>
                    </Box>
                  );
                }}
              </Formik>
            </DashBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChangePassword;
