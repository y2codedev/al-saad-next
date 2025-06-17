"use client";

import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaUser } from "react-icons/fa";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import { BsGrid } from "react-icons/bs";
import parse from "html-react-parser";
import { showToast } from "@/utils/helper";
import { Formik } from "formik";
import * as Yup from "yup";
import { blogApi } from "@/utils/services/blogServices";
import { BlogSpan, DisplayFlex, Tag } from "@/components/styles";
import Login from "@/auth/Login/Login";
import Register from "@/auth/Register/Register";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import OtpDialog from "@/auth/Login/OtpDialog";
import useUserStore from "@/store/user";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  DateRangeOutlined,
  TextsmsOutlined,
  WhatsApp,
} from "@mui/icons-material";

const BlogDetailsCard = ({ blog }) => {
 
  const { blogs, tags, blog_comment, navigation_data } = blog?.data;
  const t = useTranslations();
  const { isLoggedIn } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };
  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  const [userComment, setUserComment] = useState({
    name: "",
    email: "",
    message: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

  const addBlogComment = async (values) => {
    if (!isLoggedIn) {
      return showToast("error", t("please_login"));
    }

    if (!blogs?.id) {
      return;
    }

    try {
      const reqBody = {
        name: values?.name,
        email: values?.email,
        message: values?.message,
        blog_id: blogs?.id.toString(),
      };
      setLoading(true);
      const response = await blogApi.addBlogCommentApi(reqBody);
      if (response && response.status === 200) {
        showToast("success", response.message || "Comment added successfully");
        setUserComment({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.log(error, "error in add blog comment");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ overflowX: "hidden", mb: { xs: "50px", sm: "0px" } }}>
      {blogs && (
        <Typography fontSize="26px" fontWeight={"600"} color="#212529">
          {blogs?.title_blog}
        </Typography>
      )}
      {blogs && (
        <Box className="flex  gap-3 m-0 p-0 my-4">
          <Typography
            sx={{
              color: "#292b2c",
              cursor: "pointer",
              fontWeight: "300",
              ":hover": {
                color: "#bb1f2a",
              },
            }}
          >
            <span style={{ color: "#bb1f2a" }}>
              <DateRangeOutlined fontSize="18" />
            </span>{" "}
            {blogs?.created_at}
          </Typography>
          <Typography
            sx={{
              color: "#292b2c",
              cursor: "pointer",
              fontWeight: "300",
              ":hover": {
                color: "#bb1f2a",
              },
            }}
          >
            <span style={{ color: "#bb1f2a" }}>
              <TextsmsOutlined fontSize="18" />
            </span>{" "}
            {blogs?.comment_count}
          </Typography>
        </Box>
      )}

      {blogs && (
        <div className="relative w-full h-[400px]">
          <Image
            src={blogs.image}
            alt={blogs.title_blog}
            fill
            className="object-cover"
            priority={true}
          />
        </div>
      )}

      <Typography
        sx={{
          fontSize: "18px",
          color: "#292b2c !important",
          mt: 3,
          fontWeight: "500",
          lineHeight: 2,
          mb: 1,
        }}
      >
        {typeof blogs?.description === "string"
          ? parse(blogs.description)
          : "blog description"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Grid container spacing={3} sx={{ overflowX: "hidden" }}>
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Grid sx={{ display: "flex", gap: 1, flexWrap: "wrap" }} size={12}>
              {tags?.map((tag, index) => (
                <Link href={`?tag=${tag}`} className="link-none" key={index}>
                  <Tag>{tag}</Tag>
                </Link>
              ))}
            </Grid>
          </Grid>

          {/* Share Section */}
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <DisplayFlex justifyContent="center" gap="8px">
              <BlogSpan>
                <FaFacebookF size={24} />
              </BlogSpan>
              <BlogSpan>
                <FaTwitter size={24} />
              </BlogSpan>
              <BlogSpan backgroundColor="green">
                <WhatsApp size={24} />
              </BlogSpan>
            </DisplayFlex>
          </Grid>
        </Grid>
      </Box>

      {navigation_data?.previous?.slug || navigation_data?.next?.slug ? (
        <div className="flex flex-row justify-between items-center bg-[#f7f7f7] p-6">
          {/* Previous Navigation */}
          {navigation_data?.previous?.slug ? (
            <div className="text-sm text-[#292b2c] flex items-center hover:text-[#bb1f2a] cursor-pointer">
              <Link
                href={`/blog/${navigation_data?.previous?.slug}`}
                className="flex items-center gap-2 no-underline hover:text-[#bb1f2a]"
              >
                <WestIcon />
                <span className="hidden sm:inline">
                  {navigation_data?.previous?.title}
                </span>
              </Link>
            </div>
          ) : null}
          {/* Center Grid Icon */}
          <div className=" cursor-pointer">
            <BsGrid size={20} />
          </div>

          {/* Next Navigation */}
          {navigation_data?.next?.slug ? (
            <div className="text-sm text-[#292b2c] flex items-center justify-end gap-2 hover:text-[#bb1f2a] cursor-pointer">
              <Link
                href={
                  navigation_data?.next?.slug
                    ? `/blog/${navigation_data?.next?.slug}`
                    : "javascript:viod"
                }
                className="flex items-center gap-2 no-underline hover:text-[#bb1f2a]"
              >
                <span className="hidden sm:inline">
                  {navigation_data?.next?.title}
                </span>
                <EastIcon />
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      <DisplayFlex
        gap="16px"
        padding="1.5rem"
        sx={{
          border: "solid 1px #eee",
          my: 4,
        }}
      >
        <FaUser size={20} />
        <span style={{ color: "#687188", fontSize: "14px" }}>
          {blog?.author_name || t("author")}
        </span>
      </DisplayFlex>
      <Typography sx={{ my: 4, color: "#292b2c", fontWeight: "600" }}>
        ({blogs?.comment_count || 0}) {t("comment")}
      </Typography>
      <Box sx={{ my: 1 }}>
        {blog_comment &&
          blog_comment?.map((comment, index) => (
            <>
              <Grid
                container
                spacing={2}
                key={index}
                my={1}
                display={"flex"}
                flexWrap={"wrap"}
              >
                <Grid>
                  <Image
                    src={
                      comment?.image ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&s"
                    }
                    alt="blog-avatar"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                </Grid>
                <Grid size="grow">
                  <Typography
                    sx={{
                      color: "#292b2c",
                      fontWeight: "500",
                      fontSize: "16px",
                      ":hover": { color: "#bb1f2a", cursor: "pointer" },
                    }}
                  >
                    {comment?.coustmer_name}
                  </Typography>
                  <Typography
                    sx={{
                      my: 1,
                      color: "#687188",
                      fontSize: "14px",
                      textTransform: "uppercase",
                    }}
                  >
                    {comment?.comment_date}
                  </Typography>
                  <Typography
                    sx={{ my: 1, color: "#687188", fontSize: "16px" }}
                  >
                    {comment?.message}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ))}
      </Box>
      <Formik
        initialValues={userComment}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          await addBlogComment(values);
          resetForm();
        }}
        enableReinitialize
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          handleSubmit,
        }) => (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <TextField
                  name="name"
                  type="text"
                  value={values?.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  label={t("enter_your_name")}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <TextField
                  name="email"
                  type="email"
                  value={values?.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  label={t("please_enter_email")}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  name="message"
                  type="text"
                  value={values?.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  label={t("enter_your_message")}
                  error={touched.message && Boolean(errors.message)}
                  helperText={touched.message && errors.message}
                />
              </Grid>
              <Grid size={12}>
                <Button
                  type="submit"
                  sx={{
                    backgroundColor: "#bb1f2a",
                    color: "#fff",
                    py: 2,
                    px: 4,
                  }}
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
                      <CircularProgress color="#333" size={24} /> {t("submit")}
                      ...
                    </Box>
                  ) : (
                    t("submit")
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
      <Login
        open={openLogin}
        handleOpenRegister={handleOpenRegister}
        setOpenMobileOtp={handleOpenLogin}
        setOpenForgotPassword={setOpenForgotPassword}
        handleClose={handleCloseLogin}
        handleCloseRegister={handleCloseRegister}
        loading={loading}
        switchToRegister={switchToRegister}
      />
      <Register
        open={openRegister}
        switchToLogin={switchToLogin}
        handleClose={handleCloseRegister}
        loading={loading}
      />
      <ForgotPasswordModal
        open={openForgotPassword}
        handleClose={() => setOpenForgotPassword(false)}
        handleOpenLogin={handleOpenLogin}
        setOpenMobileOtp={setOpenMobileOtp}
        setUserData={setUserData}
      />
      <OtpDialog
        isDialogOpen={openMobileOtp}
        data={userData}
        handleCloseOtp={() => setOpenMobileOtp(false)}
      />
    </Box>
  );
};

export default BlogDetailsCard;
