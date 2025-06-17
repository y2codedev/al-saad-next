"use client";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { userService } from "@/utils/services/userServices";
import { mergeCartCall, showToast } from "@/utils/helper";
import useUserStore from "@/store/user";
import { useState, useEffect, useRef } from "react";
import { encryptData } from "@/utils/services/AlsaadRSA";
import { useSettingsStore } from "@/store/useSettingsStore";
import COLORS from "@/utils/colors";
import useAbsolutePath from "@/utils/useAbsolutePath";
import { useRouter } from "next/navigation";
import { MuiOtpInput } from "mui-one-time-password-input";

const OtpDialog = ({ isDialogOpen, handleCloseOtp, data }) => {
  const [resendTimer, setResendTimer] = useState(30);
  const { userInfo } = useUserStore();
  const selectedCountry = useSettingsStore((state) => state?.selectedCountry);
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const router = useRouter();
  const getPath = useAbsolutePath();
  const formikRef = useRef(null);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setResendTimer(30);

    try {
      if (!data) return;
      if (formikRef.current) {
        formikRef.current?.resetForm();
      }

      const encryptedPhone = encryptData(data.phone);
      const encryptedCountryCode = encryptData(data.country_code?.toString());

      const encryptedData = {
        user_id: data?.user_id || "",
        country_code: encryptedCountryCode,
        phone: encryptedPhone,
        type: "phone",
      };

      const response = await userService.sendOtp(encryptedData);

      if (response?.status === 200) {
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
      }
    } catch (error) {
      console.error("Error in resend OTP:", error);
    }
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .length(6, "OTP must be exactly 6 digits")
      .required("OTP is required"),
  });

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const req = {
        user_id: data?.user_id,
        type: data.type,
        otp: values.otp,
        country_code: data.country_code || "",
      };

      // OTP verification
      const otpResponse = await userService.verifyOtp(req);
      if (otpResponse?.status !== 200) {
        return showToast("error", otpResponse.message);
      }

      if (otpResponse?.status === 200 && data?.from === "forgot") {
        handleCloseOtp();
        setTimeout(() => {
          showToast("success", otpResponse?.message);
          router.push(`/reset-password?u=${req?.user_id}`);
        }, 500);
        return;
      }

      const encryptedId = encryptData(req?.user_id?.toString());
      const reqBody = {
        customer_id: encryptedId || "",
        country_code: data?.country_code || "",
        phone: data?.phone || "",
        is_mobile_verified: 1,
        is_registered: 1,
        verification_type: data.type,
        email: userInfo?.email || data?.email || "",
      };

      const mobileResponse = await userService.verifyMobile(reqBody);
      if (mobileResponse?.status === 200) {
        handleCloseOtp();
        await mergeCartCall(
          localStorage.getItem("cart_id"),
          mobileResponse.data?.id,
        );
        await setUserInfo(mobileResponse.data);
        showToast("success", "OTP verification successful.");
        resetForm();
        sessionStorage.setItem("mobile_verification_skipped", "true");
      } else {
        return showToast("error", mobileResponse.message);
      }
    } catch (error) {
      console.error("Error in OTP verification:", error);
      showToast(
        "error",
        error?.message || "Verification failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseOtp}
      maxWidth="xs"
      fullWidth
      disableScrollLock
    >
      <Box sx={{ padding: "24px", position: "relative" }}>
        <IconButton
          onClick={handleCloseOtp}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#000",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontSize: "20px", mb: 1 }}
        >
          Enter OTP
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Enter the OTP sent to your mobile
        </Typography>

        <Formik
          initialValues={{ otp: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          innerRef={formikRef}
        >
          {({
            isSubmitting,
            isValid,
            handleChange,
            values,
            handleBlur,
            errors,
            touched,
            handleSubmit,
            setFieldValue,
          }) => (
            <>
              {/* <Typography
                variant="body2"
                sx={{ fontWeight: 500, mb: 0.5, color: COLORS.grey, mb: '8px', fontSize: '18px' }}
              >
                OTP
              </Typography> */}
              {/* <TextField
                fullWidth
                placeholder="Enter OTP"
                name="otp"
                value={values.otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  e.target.value = value;
                  handleChange(e);
                }}
                onBlur={handleBlur}
                error={touched.otp && Boolean(errors.otp)}
                helperText={touched.otp && errors.otp}
                inputProps={{
                  maxLength: 6,
                  style: { textAlign: "center", fontSize: "20px" },
                  datatype: "numeric",
                }}
              /> */}
              <MuiOtpInput
                gap={"44px"}
                value={values.otp}
                maxWidth={"200px"}
                onChange={(val) => setFieldValue("otp", val)}
                length={6}
                TextFieldsProps={{ size: "small", boderRadius: "10px", mx: 1 }}
                sx={{
                  maxWidth: "270px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    height: "47px",
                    width: "47px",
                    transition: "all 0.3s ease",
                    bgcolor: "#fff",
                    "&.Mui-focused": {
                      borderColor: "#1976d2",
                      backgroundColor: "#e3f2fd",
                      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                    },
                  },
                  "& .MuiInputBase- ": {
                    textAlign: "center",
                    fontSize: "20px",
                  },
                }}
                autoFocus
                onBlur={handleBlur}
              />
              {errors.otp && touched.otp ? (
                <div
                  style={{ color: "red", marginTop: "5px", fontSize: "12px" }}
                >
                  {errors.otp}
                </div>
              ) : null}
              <DialogActions sx={{ mt: 1, px: 0 }}>
                <Button
                  disabled={isSubmitting || resendTimer !== 0}
                  variant="outlined"
                  color="error"
                  onClick={handleResendOtp}
                  sx={{
                    width: "30%",
                    py: 1.4,
                    borderRadius: "2px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resendTimer === 0
                    ? "Resend OTP"
                    : `Resend in ${resendTimer}s`}
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    width: "30%",
                    py: 1.4,
                    borderRadius: "2px",
                    backgroundColor: "#bb1f2a",
                  }}
                  disabled={!isValid || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Verifying..." : "Verify"}
                </Button>
              </DialogActions>
            </>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
};

export default OtpDialog;
