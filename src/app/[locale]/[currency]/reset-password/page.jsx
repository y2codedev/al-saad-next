"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/material";
import { userService } from "@/utils/services/userServices";
import { showToast } from "@/utils/helper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const location = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("u");
  const token = searchParams.get("token");
  const navigate = useRouter();

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!userId) {
          showToast("error", "User not found", "Error");
          return;
        }
        const reqBody = {
          user_id: userId,
          password: values?.password,
          confirm_password: values?.confirm_password,
          token,
        };
        const response = await userService.resetPassword(reqBody);
        if (response && response.status === 200) {
          showToast(
            "success",
            response?.message,
            "Password Reset Successfully",
          );
          navigate.replace("/");
        } else {
          showToast("error", response?.message || "Error in reset password");
        }
      } catch (error) {
        showToast("error", error, "Error in reset password");
      }
    },
  });

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        px: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: "500px",
          boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
          overflow: "hidden",
          p: { xs: 4, sm: 6 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontSize: { xs: "20px", sm: "24px" },
            fontWeight: "700",
          }}
        >
          Reset Password
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            placeholder="Password"
            type="password"
            variant="outlined"
            margin="normal"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            fullWidth
            placeholder="Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
            name="confirm_password"
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            error={
              formik.touched.confirm_password &&
              Boolean(formik.errors.confirm_password)
            }
            helperText={
              formik.touched.confirm_password && formik.errors.confirm_password
            }
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#bb1f2a",
              color: "#fff",
              borderRadius: "4px",
              mt: 2,
            }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "white",
                }}
              >
                <CircularProgress color="#fff" size={24} /> Resetting...
              </Box>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;
