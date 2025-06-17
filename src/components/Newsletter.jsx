"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { newsLetterApi } from "@/utils/services/newsLetterServices";
import { showToast } from "@/utils/helper";
import { useTranslations } from "next-intl";
import { Container } from "@mui/material";

const Newsletter = () => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    onSubmit: async (values, { resetForm }) => {
      if (!values?.email?.trim()) {
        showToast("error", t("please_enter_email"));
        return;
      }

      setLoading(true);
      try {
        const res = await newsLetterApi.newsLetter({ email: values.email });
        if (res && res.status === 200) {
          showToast("success", res?.message);
          resetForm();
        }
      } catch (error) {
        showToast("error", error?.message || t("error_generic"));
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div
      className={`bg-[#bb1f2a] sm:py-10 py-10 pb-20 mb-14 sm:mb-0 overflow-hidden`}
    >
      <Container maxWidth="lg">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-1/2">
            <h2 className="text-white text-xl sm:text-2xl font-semibold">
              {t("subscribe_newsletter")}
            </h2>
          </div>
          <div className="w-full sm:w-1/2">
            <form onSubmit={formik.handleSubmit} className="flex w-full">
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("please_enter_email")}
                className="w-full px-4 py-3 bg-white text-black placeholder-gray-600 outline-none focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white font-semibold sm:px-6 px-2 py-3 cursor-pointer border border-black"
              >
                {loading ? `${t("subscribe_btn")}...` : t("subscribe_btn")}
              </button>
            </form>
          </div>
        </div>
      </div>
       </Container>
    </div>
  );
};

export default Newsletter;
