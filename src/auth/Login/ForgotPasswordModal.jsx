"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Container,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import OtpDialog from "./OtpDialog";
import { useCountryStore } from "@/store/useCountryStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { userService } from "@/utils/services/userServices";
import { showToast } from "@/utils/helper";
import { encryptData } from "@/utils/services/AlsaadRSA";
import { useMediaQuery } from "@mui/system";
import COLORS from "@/utils/colors";

const ForgotPasswordModal = ({
  open,
  handleClose,
  handleOpenLogin,
  setOpenMobileOtp,
  setUserData,
}) => {
  const theme = useTheme();

  const switchToRegister = () => {
    handleOpenLogin();
    handleClose();
  };
  const { countries } = useCountryStore();
  const selectedCountry = useSettingsStore((state) => state?.selectedCountry);
  const setSelectedCountry = useSettingsStore(
    (state) => state?.setSelectedCountry,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenOtp = () => setIsDialogOpen(true);
  const handleCloseOtp = () => setIsDialogOpen(false);

  const sendOtp = async (phone, code, id) => {
    try {
      const encryptPhone = encryptData(phone || "").toString();
      const encryptCode = code ? encryptData(code || "").toString() : "";
      const req = {
        user_id: id,
        phone: encryptPhone?.toString(),
        type: "phone",
        country_code: encryptCode?.toString(),
      };
      const res = await userService.sendOtp(req);
      if (res && res?.status === 200) {
        setUserData({
          user_id: id || "",
          country_code: code,
          phone: phone,
          type: "phone",
          from: "forgot",
        });
        showToast("success", res?.message);
      } else {
        showToast("error", res?.message, "danger" || "");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleForgotPassword = async (values) => {
    try {
      let request = {
        phone: values.isEmail ? values.email : values.phone,
        type: values.isEmail ? "email" : "phone",
        country_code: values.isEmail ? values.countryCode : values.countryCode,
      };
      let response = await userService.forgotPassword(request);

      if (response && response.status === 200) {
        if (!values.isEmail) {
          handleClose();
          sendOtp(
            values?.phone,
            values?.countryCode,
            response?.data?.user_id?.toString(),
          );
          setOpenMobileOtp(true);
        } else {
          handleClose();
          showToast(
            "success",
            response?.data?.message || "link has been sent on registered email",
          );
        }
      } else {
        showToast("error", response?.message || "");
      }
    } catch (error) {
      showToast("error", error.message, "danger" || "");
    }
  };

  const validationSchema = Yup.object({
    isEmail: Yup.boolean(),
    email: Yup.string().when("isEmail", ([isEmail], schema) => {
      if (isEmail)
        return Yup.string()
          .email("Invalid email address")
          .required("Email is required");
      return schema.notRequired();
    }),
    phone: Yup.string().when("isEmail", ([isEmail], schema) => {
      if (!isEmail) return Yup.string().required("Phone number is required");
      return schema.notRequired();
    }),
    countryCode: Yup.string().when("isEmail", ([isEmail], schema) => {
      if (!isEmail) return Yup.string().required("Country code is required");
      return schema.notRequired();
    }),
  });

  return (
    <>
      <Modal
        maxWidth="sm"
        disablePortal={true}
        disableScrollLock
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        fullScreen={useMediaQuery(theme.breakpoints.down("sm"))}
        open={open}
        onClose={handleClose}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: "",
              phone: "",
              countryCode: selectedCountry?.code,
              isEmail: true,
            }}
            validationSchema={validationSchema}
            onSubmit={handleForgotPassword}
          >
            {({
              handleChange,
              handleBlur,
              isSubmitting,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => {
              return (
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    px: { xs: 2, sm: 4 },
                    py: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { sm: "20px", xs: "16px" },
                        fontWeight: 600,
                      }}
                    >
                      Forgot Password
                    </Typography>
                    <Close onClick={handleClose} sx={{ cursor: "pointer" }} />
                  </Box>
                  <Grid container spacing={3}>
                    {values?.isEmail ? (
                      <Grid size={{ xs: 12 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: COLORS.grey, mb: 0.5 }}
                        >
                          E-Email
                        </Typography>
                        <TextField
                          type="email"
                          name="email"
                          value={values?.email}
                          onChange={handleChange}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          fullWidth
                          placeholder="E-Email"
                          required
                          sx={{
                            "& label.Mui-focused": { color: "#bb1f2a" },
                          }}
                        />
                      </Grid>
                    ) : (
                      <Grid size={{ xs: 12 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: COLORS.grey, mb: 0.5 }}
                        >
                          Mobile Number
                        </Typography>
                        <Box
                          sx={{
                            flexDirection: { xs: "column", sm: "row" },

                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 5, sm: 4 }}>
                              <FormControl fullWidth>
                                <Select
                                  value={selectedCountry?.code || ""}
                                  onChange={(event) => {
                                    const selectedCountry = countries?.find(
                                      (country) =>
                                        country?.code === event.target.value,
                                    );
                                    setSelectedCountry(selectedCountry);
                                  }}
                                  variant="outlined"
                                  sx={{
                                    padding: "2px 4px",
                                    border: "1px solid #ccc",
                                    ".MuiOutlinedInput-notchedOutline": {
                                      border: "none",
                                    },
                                    ".MuiSelect-select": {
                                      padding: "13px 0px",
                                      fontSize: "14px",
                                      color: "#333",
                                      display: "flex",
                                      alignItems: "center",
                                    },
                                  }}
                                >
                                  {countries?.map((country, index) => (
                                    <MenuItem key={index} value={country?.code}>
                                      <img
                                        src={country?.flag}
                                        alt={country?.name}
                                        style={{
                                          width: "23px",
                                          height: "23px",
                                          marginRight: "4px",
                                        }}
                                      />
                                      {country?.code}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 7, sm: 8 }}>
                              <TextField
                                fullWidth
                                placeholder="Mobile Number"
                                name="phone"
                                value={values?.phone}
                                onChange={handleChange}
                                error={touched.phone && Boolean(errors.phone)}
                                helperText={touched.phone && errors.phone}
                                required
                                sx={{
                                  "& label.Mui-focused": { color: "#bb1f2a" },
                                }}
                              />
                            </Grid>
                            <OtpDialog
                              open={isDialogOpen}
                              onClose={handleCloseOtp}
                            />
                          </Grid>
                        </Box>
                      </Grid>
                    )}
                    <Grid size={{ xs: 12 }}>
                      <Typography
                        onClick={() =>
                          setFieldValue("isEmail", !values.isEmail)
                        }
                        sx={{
                          fontSize: {
                            sm: "16px",
                            xs: "14px",
                            textAlign: "right",
                          },
                          cursor: "pointer",
                        }}
                        color="#bb1f2a"
                      >
                        Use another option
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        fullWidth
                        variant="contained"
                        sx={{
                          px: 4,
                          py: 1.5,
                          background: "#bb1f2a",
                          color: "#fff",
                        }}
                      >
                        {values?.isEmail ? "Submit" : "Send OTP"}
                      </Button>
                    </Grid>
                    <Grid
                      size={{ xs: 12 }}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#ddd",
                          height: "1px",
                          width: "100%",
                        }}
                      ></span>
                      <span
                        style={{
                          color: "#687188",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        OR
                      </span>
                      <span
                        style={{
                          backgroundColor: "#ddd",
                          height: "1px",
                          width: "100%",
                        }}
                      ></span>
                    </Grid>
                    <Grid
                      size={{ xs: 12 }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" color="#6c757d">
                        Already have an account?
                        <span
                          onClick={switchToRegister}
                          style={{
                            cursor: "pointer",
                            color: "#bb1f2a",
                            fontWeight: "bold",
                          }}
                        >
                          &nbsp; Log in
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              );
            }}
          </Formik>
        </Container>
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
