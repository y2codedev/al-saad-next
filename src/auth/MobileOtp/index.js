import React from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import * as Yup from "yup";
import { Formik } from "formik";
import { MuiOtpInput } from "mui-one-time-password-input";
import { userService } from "@/utils/services/userServices";
import { showToast } from "@/utils/helper";

const MobileOtpDialog = ({ open, onClose, userId, setOpenMobileOtp }) => {
  const handleVerifyOtp = async (values) => {
    const request = {
      user_id: userId,
      otp: values.otp,
    };
    try {
      const response = await userService.verifyOtp(request);
      if (response && response.status === 200) {
        setOpenMobileOtp(false);
        showToast("success", response.message, "success");
      } else {
        showToast("error", response.message, "danger");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required")
      .matches(/^\d+$/, "OTP must only contain digits"),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="otp-dialog-title"
      aria-describedby="otp-dialog-description"
      PaperProps={{
        sx: {
          px: "20px",
          py: "20px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 1,
            right: 1,
            color: "#000",
          }}
        >
          <Close />
        </IconButton>

        <Typography
          variant="h6"
          id="otp-dialog-title"
          sx={{
            fontWeight: "bold",
            mt: 1,
            fontSize: "20px",
            textAlign: "left",
          }}
        >
          Enter OTP
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          id="otp-dialog-description"
          sx={{ mb: 2, textAlign: "left" }}
        >
          Enter the code sent to your mobile
        </Typography>
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleVerifyOtp(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              <Box>
                <MuiOtpInput
                  value={values.otp}
                  onChange={(val) => setFieldValue("otp", val)}
                  length={6}
                  sx={{
                    direction: "ltr",
                    maxWidth: "270px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      height: "47px",
                      width: "47px",
                    },
                    "& .MuiOtpInput-TextField	": {
                      borderRadius: "0px",
                    },
                  }}
                  autoFocus
                />
                {errors.otp && touched.otp ? (
                  <div
                    style={{ color: "red", marginTop: "5px", fontSize: "12px" }}
                  >
                    {errors.otp}
                  </div>
                ) : null}

                <Button
                  fullWidth
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: "#bb1f2a",
                    color: "#fff",
                    width: "100%",
                    fontSize: "16px",
                  }}
                >
                  Verify OTP
                </Button>
              </Box>
            </>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
};

export default MobileOtpDialog;
