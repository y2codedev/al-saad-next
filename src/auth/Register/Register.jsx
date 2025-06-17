"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  MenuItem,
  FormControl,
  CircularProgress,
  DialogTitle,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Formik } from "formik";
import { showToast } from "@/utils/helper";
import { userService } from "@/utils/services/userServices";
import { encryptData } from "@/utils/services/AlsaadRSA";
import useUserStore from "@/store/user";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCountryStore } from "@/store/useCountryStore";
import {
  TextFieldStyled,
  SelectStyled,
  ButtonStyled,
  LoginText,
  TermsText,
  CheckboxStyled,
} from "./styles";
import COLORS from "@/utils/colors";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  phone: Yup.string()
    .matches(/^\d+$/, "Only numbers are allowed")
    .min(9, "Must be at least 9 digits")
    .max(9, "Cannot exceed 9 digits")
    .required("Mobile number is required"),
  countryCode: Yup.string().required("Country code is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  name: Yup.string().required("Name is required"),
});

const Register = ({ handleClose, open, switchToLogin }) => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const { countries, fetchCountries } = useCountryStore();
  const { selectedCountry, setSelectedCountry } = useSettingsStore();

  const navigateToTermsCondactions = () => {
    handleClose();
    router.push("/terms-of-use");
  };

  const handleEncryptPassword = async (password) => {
    try {
      const res = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error("Encryption failed");
      }

      const data = await res.json();
      return data.encrypted;
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  };

  const handleRegister = async (values) => {
    if (!checkedTerms) {
      return showToast("error", "Accept terms and conditions");
    }

    if (values?.password !== values?.confirm_password) {
      showToast("error", "Passwords do not match");
      return;
    }

    setLoading(true);

    const encryptCPass = await handleEncryptPassword(
      values?.confirm_password || "",
    );
    const encryptPass = await handleEncryptPassword(values?.password || "");

    let request = {
      email: values.email,
      phone: values.phone,
      name: values.name,
      country_code: values.countryCode,
      password: encryptPass,
      confirm_password: encryptCPass,
      lang_type: "en",
    };

    try {
      let response = await userService.signUp(request);

      if (response && response.status === 200) {
        setLoading(false);
        handleClose();
        setUserInfo(response.data);
        showToast("success", response.message, "success");
        router.push("/");
      } else {
        showToast("error", response.message, "danger");
        setLoading(false);
      }
    } catch (error) {
      showToast("error", error.message, "danger");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!countries) {
      fetchCountries();
    }
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disableScrollLock
      fullScreen={isMobile}
      sx={{
        maxHeight: "90vh",
        "& .MuiDialog-container": {
          alignItems: "center",
          alignSelf: "center",
        },
      }}
      PaperProps={{ sx: { mt: "100px", verticalAlign: "center" } }}
    >
      <Formik
        enableReinitialize
        initialValues={{
          isEmail: true,
          email: "",
          password: "",
          confirm_password: "",
          phone: "",
          countryCode: selectedCountry?.code ?? "",
          name: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <Box
            sx={{
              borderRadius: 2,
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: { sm: "20px", xs: "16px" },
                fontWeight: 600,
              }}
            >
              Create an Account
              <Close sx={{ cursor: "pointer" }} onClick={handleClose} />
            </DialogTitle>

            <DialogContent>
              <Grid container spacing={3}>
                {/* Name */}
                <Grid item size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: COLORS.grey, mb: 0.5 }}
                  >
                    Name
                  </Typography>
                  <TextFieldStyled
                    fullWidth
                    placeholder="Your Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    required
                  />
                </Grid>

                {/* Mobile Number */}
                <Grid item size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: COLORS.grey, mb: 0.5 }}
                  >
                    Mobile Number
                  </Typography>
                  <Grid container spacing={2} sx={{ width: "100%" }}>
                    <Grid item size={{ xs: 4 }}>
                      <FormControl fullWidth>
                        <SelectStyled
                          value={selectedCountry?.code || ""}
                          onChange={(event) =>
                            setSelectedCountry(
                              countries.find(
                                (country) =>
                                  country.code === event.target.value,
                              ),
                            )
                          }
                        >
                          {countries?.map((country, index) => (
                            <MenuItem
                              key={index}
                              value={country.code}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <img
                                src={country.flag}
                                alt={country.name}
                                className="w-[23px] h-[23px] mr-[4px]"
                              />
                              <span>{country.code}</span>
                            </MenuItem>
                          ))}
                        </SelectStyled>
                      </FormControl>
                    </Grid>
                    <Grid item size={{ xs: 8 }}>
                      <TextFieldStyled
                        fullWidth
                        placeholder="Mobile Number"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Email */}
                <Grid item size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: COLORS.grey, mb: 0.5 }}
                  >
                    Your Email
                  </Typography>
                  <TextFieldStyled
                    fullWidth
                    placeholder="Enter Your Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    required
                  />
                </Grid>

                {/* Password */}
                <Grid item size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: COLORS.grey, mb: 0.5 }}
                  >
                    Password
                  </Typography>
                  <TextFieldStyled
                    fullWidth
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    required
                  />
                </Grid>

                {/* Confirm Password */}
                <Grid item size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: COLORS.grey, mb: 0.5 }}
                  >
                    Confirm Password
                  </Typography>
                  <TextFieldStyled
                    fullWidth
                    placeholder="Confirm Password"
                    name="confirm_password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    error={
                      touched.confirm_password &&
                      Boolean(errors.confirm_password)
                    }
                    helperText={
                      touched.confirm_password && errors.confirm_password
                    }
                    required
                  />
                </Grid>

                {/* Terms Checkbox */}
                <Grid item size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckboxStyled
                      value={checkedTerms}
                      onChange={(e) => setCheckedTerms(e.target.checked)}
                    />
                    <TermsText onClick={navigateToTermsCondactions}>
                      I agree to terms & Policy.
                    </TermsText>
                  </Box>
                </Grid>

                {/* Submit Button */}
                <Grid item size={{ xs: 12 }}>
                  <ButtonStyled
                    fullWidth
                    type="submit"
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "white",
                        }}
                      >
                        <CircularProgress size={24} /> Register...
                      </Box>
                    ) : (
                      "Register"
                    )}
                  </ButtonStyled>
                </Grid>

                {/* Switch to Login */}
                <Grid
                  item
                  size={{ xs: 12 }}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography sx={{ color: "#6c757d", display: "flex" }}>
                    Already have an account?{" "}
                    <LoginText onClick={switchToLogin}>&nbsp; Log in</LoginText>
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
          </Box>
        )}
      </Formik>
    </Dialog>
  );
};

export default Register;
