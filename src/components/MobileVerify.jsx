"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSettingsStore } from "@/store/useSettingsStore";
import { userService } from "@/utils/services/userServices";
import useUserStore from "@/store/user";
import { encryptData } from "@/utils/services/AlsaadRSA";
import { showToast } from "@/utils/helper";
import OtpDialog from "@/auth/Login/OtpDialog";
import { useTranslations } from "next-intl";
import { useCountryStore } from "@/store/useCountryStore";
const MobileVerify = ({ open, onClose, onSkip, title = "" }) => {
  const [data, setData] = useState(null);
  const { userInfo } = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenOtp = () => setIsDialogOpen(true);
  const handleCloseOtp = () => setIsDialogOpen(false);
  const t = useTranslations();
  const selectedCountry = useSettingsStore((state) => state.selectedCountry);

  const validationSchema = Yup.object({
    mobileNumber: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("Mobile number is required")
      .min(9, "Must be at least 9 digits")
      .max(9, "Cannot exceed 9 digits"),
  });

  const checkUser = async (phone, code, type, resetForm, setSubmitting) => {
    try {
      const req = {
        phone,
        type,
        country_code: code,
        customer_id: userInfo?.id ?? "",
        email: phone,
      };
      const res = await userService.checkUser(req);
      if (res?.status !== 200 || res?.data?.is_registerd) {
        showToast("error", res?.message || "User verification failed.");
        return;
      }
      const encryptedPhone = encryptData(phone);
      const encryptedCountryCode = encryptData(code?.toString());
      const encryptedData = {
        user_id: userInfo?.id || "",
        country_code: encryptedCountryCode,
        phone: encryptedPhone,
        type: "phone",
      };
      const response = await userService.sendOtp(encryptedData);

      if (response?.status === 200) {
        setData({
          user_id: userInfo?.id || "",
          country_code: code?.toString(),
          phone: phone,
          type: "phone",
        });
        showToast("success", response?.message);
        handleOpenOtp();
        resetForm();
        onClose();
      } else {
        showToast("error", response?.message);
      }
    } catch (error) {
      console.error("Error in checkUser:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: userInfo?.name,
        email: userInfo?.email,
        mobileNumber: userInfo?.phone?.toString(),
        country_code: userInfo?.country_code,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        checkUser(
          values.mobileNumber,
          userInfo?.country_code,
          "phone",
          resetForm,
          setSubmitting,
        );
      }}
      enableReinitialize
    >
      {({
        handleChange,
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
        handleSubmit,
        handleBlur,
      }) => (
        <>
          <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            disableScrollLock
          >
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {t("mobile_verify")}
              <IconButton onClick={onClose} sx={{ color: "black" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <InputLabel sx={{ mb: 1 }}>{t("mobile_number")}</InputLabel>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <FormControl sx={{ minWidth: 130 }}>
                    <Select
                      disabled
                      value={userInfo?.country_code}
                      sx={{ cursor: "not-allowed" }}
                    >
                      <MenuItem value={userInfo?.country_code}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={
                              useCountryStore.getState()?.countries?.find(item => item.code == userInfo?.country_code)
                                ?.flag
                            }
                            alt="Country Flag"
                            style={{ width: 23, height: 23, marginRight: 8 }}
                          />
                          <span>{userInfo?.country_code}</span>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    placeholder={t("mobile_number")}
                    name="mobileNumber"
                    value={values.mobileNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                    helperText={touched.mobileNumber && errors.mobileNumber}
                    inputProps={{ maxLength: 15 }}
                  />
                </div>
                <DialogActions
                  sx={{
                    display: "flex",
                    px: 0,
                    alignItems: "center",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  {onSkip && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={onSkip}
                      sx={{ width: "30%", py: 1.4, borderRadius: "2px" }}
                    >
                      {t("skip")}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    sx={{ width: "30%", py: 1.4, borderRadius: "2px" }}
                    disabled={
                      !isValid ||
                      isSubmitting ||
                      (values.mobileNumber == userInfo?.phone &&
                        userInfo?.is_mobile_verified)
                    }
                  >
                    {isSubmitting ? t("submitting") : t("submit")}
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          <OtpDialog
            isDialogOpen={isDialogOpen}
            data={data}
            handleCloseOtp={handleCloseOtp}
          />
        </>
      )}
    </Formik>
  );
};

export default MobileVerify;
