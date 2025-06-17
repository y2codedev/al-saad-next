"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { FaFacebookF } from "react-icons/fa";
import AppleIcon from "@mui/icons-material/Apple";
import { Close } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import useUserStore from "@/store/user";
import { showToast, mergeCartCall } from "@/utils/helper";
import { decryptData, encryptData } from "@/utils/services/AlsaadRSA";
import { userService } from "@/utils/services/userServices";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCountryStore } from "@/store/useCountryStore";
import { signInWithPopup } from "firebase/auth";
import { auth, facebookProvider, provider } from "@/utils/firebase";
import { useWishListStore } from "@/store/useWishListStore";
import { FcGoogle } from "react-icons/fc";
import { ButtonStyled } from "../Register/styles";
import COLORS from "@/utils/colors";
const Login = ({
  handleClose,
  open,
  handleCloseRegister,
  switchToRegister,
  setOpenForgotPassword,
}) => {
  const [checked, setChecked] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { countries } = useCountryStore();
  const selectedCountry = useSettingsStore((state) => state?.selectedCountry);
  const setSelectedCountry = useSettingsStore(
    (state) => state?.setSelectedCountry,
  );
  const [loading, setLoading] = useState(false);
  const setUserInfo = useUserStore((state) => state?.setUserInfo);
  const { getWishList } = useWishListStore();
  const [credentials, setCredentials] = useState({});

  const toggleCheck = (event) => {
    setChecked(event.target.checked);
  };

  const handledecryptPassword = async (password) => {
    try {
      const res = await fetch("/api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encrypted: password }),
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Encryption failed");
      }
      const data = await res.json();
      return data.decrypted;
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadCredentials = async () => {
      const storedCredentials = sessionStorage.getItem("rememberMe");
      if (storedCredentials) {
        let decirptData = await handledecryptPassword(storedCredentials);
        if (decirptData) {
          const decryptedData = JSON.parse(decirptData);
          setChecked(true);
          setCredentials(decryptedData);
        }
      }
    };

    loadCredentials();
  }, []);

  const handleEncryptPassword = async (password) => {
    try {
      const res = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        cache: "no-store",
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

  const handleLogin = async (values) => {
    setLoading(true);
    const encrypted = await handleEncryptPassword(values?.password || "");

    try {
      const request = {
        email: values.isEmail ? values?.email : values?.phone,
        password: encrypted,
        lang_type: "en",
        country_code: values?.isEmail ? "" : values?.countryCode,
      };
      const response = await userService.signIn(request);
      if (response && response.status === 200) {
        handleClose();

        if (checked) {
          const encrypteData = encryptData(JSON.stringify(values));
          sessionStorage.setItem("rememberMe", encrypteData);
        } else {
          sessionStorage.removeItem("rememberMe");
        }
        await mergeCartCall(
          localStorage.getItem("cart_id"),
          response?.data?.id,
        );
        await setUserInfo(response.data);
        getWishList();
        showToast("success", response.message, "success");
      } else {
        showToast("error", response.message, "danger");
        setLoading(false);
      }
    } catch (error) {
      showToast("error", error.message, "danger");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (type) => {
    try {
      let result;
      if (type === "google") {
        result = await signInWithPopup(auth, provider);
      } else if (type === "facebook") {
        result = await signInWithPopup(auth, facebookProvider);
      }

      if (!result) throw new Error("No result returned from sign-in");

      const user = result.user;
      const userId = user.uid;
      const encryptedToken = encryptData(userId);

      const data = {
        name:
          user.displayName || result?.additionalUserInfo?.profile?.name || "",
        email: user.email || result?.additionalUserInfo?.profile?.email || "",
        phone: "",
        social_id: encryptedToken,
        login_by: type,
        lang_type: "en",
        avatar:
          user.photoURL ||
          result?.additionalUserInfo?.profile?.picture?.data?.url ||
          "",
      };

      const response = await userService.socialLogin(data);

      if (response && response.status === 200) {
        handleClose();
        showToast("success", response.message, "success");
        await mergeCartCall(
          localStorage.getItem("cart_id"),
          response?.data?.id,
        );
        await setUserInfo(response.data);
      } else {
        showToast("error", response?.message || "Failed to log in", "danger");
        console.error("Login API error:", response);
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      showToast(
        "error",
        error.message || "An error occurred during sign-in",
        "danger",
      );
    }
  };

  const handleForgot = () => {
    handleClose();
    handleCloseRegister();
    setTimeout(() => {
      setOpenForgotPassword(true);
    }, 100);
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
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
  });

  return (
    <Dialog
      aria-labelledby="login-dialog-title"
      aria-describedby="login-dialog-description"
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
      <Box
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "600px",
        }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            isEmail: credentials?.isEmail || true,
            email: credentials?.email ?? "",
            password: credentials?.password ?? "",
            phone: credentials?.phone ?? "",
            countryCode: selectedCountry?.code,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => {
            return (
              <Box
                sx={{
                  borderRadius: 2,
                }}
              >
                <DialogTitle
                  component="h2"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",

                    fontSize: { sm: "20px", xs: "16px" },
                    fontWeight: 600,
                  }}
                >
                  Login
                  <Close sx={{ cursor: "pointer" }} onClick={handleClose} />
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={3} sx={{ mt: "1px" }}>
                    {values?.isEmail ? (
                      <Grid size={{ xs: 12, sm: 12 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: COLORS.grey, mb: 0.5 }}
                        >
                          Enter Email
                        </Typography>
                        <TextField
                          type="email"
                          fullWidth
                          placeholder="Enter Email"
                          name="email"
                          error={touched.email && Boolean(errors.email)}
                          onChange={handleChange}
                          value={values.email}
                          helperText={touched.email && errors.email}
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
                        <Box>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 5, sm: 4 }}>
                              <FormControl fullWidth>
                                <Select
                                  value={selectedCountry?.code || ""}
                                  onChange={(event) => {
                                    const selectedCountry = countries.find(
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
                                        className="w-[23px] h-[23px] mr-[4px]"
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
                                error={touched.phone && Boolean(errors.phone)}
                                helperText={touched.phone && errors.phone}
                                onChange={handleChange}
                                required
                                sx={{
                                  "& label.Mui-focused": { color: "#bb1f2a" },
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    )}
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography
                          onClick={() =>
                            setFieldValue("isEmail", !values.isEmail)
                          }
                          sx={{
                            fontSize: {
                              sm: "16px",
                              xs: "14px",
                              cursor: "pointer",
                              textAlign: "right",
                              color: "#bb1f2a",
                              width: "fit-content",
                            },
                          }}
                        >
                          {values?.isEmail
                            ? "Login by Mobile Number"
                            : "Login by Email"}
                        </Typography>
                      </Box>
                      <Box mt={2}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: COLORS.grey, mb: 0.5 }}
                        >
                          Enter Password
                        </Typography>
                        <TextField
                          type="password"
                          name="password"
                          value={values?.password}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          onChange={handleChange}
                          fullWidth
                          placeholder="Enter Password"
                          required
                          sx={{
                            "& label.Mui-focused": { color: "#bb1f2a" },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={toggleCheck}
                              sx={{
                                "&.Mui-checked": {
                                  color: COLORS.primary,
                                },
                              }}
                            />
                          }
                          label="Remember me"
                          sx={{
                            color: "#687188",
                          }}
                        />
                        <Typography
                          onClick={() => {
                            handleForgot();
                          }}
                          sx={{
                            fontSize: {
                              sm: "16px",
                              xs: "14px",
                              cursor: "pointer",
                            },
                          }}
                          variant="body2"
                          color="#687188"
                        >
                          Forgot Password
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
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
                            <CircularProgress color="#333" size={24} /> Login...
                          </Box>
                        ) : (
                          "Login"
                        )}
                      </ButtonStyled>
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
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "#3b5998",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleGoogleSignIn("facebook");
                        }}
                      >
                        <FaFacebookF color="#fff" />
                      </div>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "#fff",
                          borderRadius: "50%",
                          boxShadow: "0 0 10px rgb(0 0 0 / 20%)",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleGoogleSignIn("google");
                        }}
                      >
                        <FcGoogle size={30} />
                      </div>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "#000",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      >
                        <AppleIcon sx={{ fontSize: "30px", color: "#fff" }} />
                      </div>
                    </Grid>
                    <Grid
                      size={{ xs: 12 }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        my: 1,
                      }}
                    >
                      <Typography variant="body2" color="#687188">
                        Don't have an account?
                        <span
                          onClick={switchToRegister}
                          style={{
                            cursor: "pointer",
                            color: "#bb1f2a",
                            fontWeight: "bold",
                          }}
                        >
                          &nbsp; Sign up
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </DialogContent>
              </Box>
            );
          }}
        </Formik>
      </Box>
    </Dialog>
  );
};

export default Login;
