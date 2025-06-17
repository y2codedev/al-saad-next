"use client";

import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Email, Phone } from "@mui/icons-material";
import { showToast } from "@/utils/helper";
import contactApi from "@/utils/services/contactEnquireServices";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useTranslations } from "next-intl";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{9}$/, "Phone number must be exactly 9 digits")
    .required("Phone number is required"),
  message: Yup.string().required("Message is required"),
});

const FormContainer = styled(Grid)`
  margin-top: 2rem;
`;

const SectionTitle = styled(Typography)`
  margin-bottom: 1rem;
  font-weight: 700;
  font-family: "Roboto", sans-serif;
`;

const FormDescription = styled(Typography)`
  margin-bottom: 1rem;
  font-weight: 400;
  font-size: 14px;
  color: #687188;
`;

const StyledButton = styled(Button)`
  background: #bb1f2a;
  color: white;
  padding: 1rem 2rem;
  &:hover {
    background-color: #a3171d;
  }
`;

const ContactCardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StyledCard = styled(Card)`
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled(Box)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid #bb1f2a;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #bb1f2a;
  transition: all 0.3s ease;
  &:hover {
    background-color: #bb1f2a;
    color: white;
  }
`;

const ContactCardContent = styled(CardContent)`
  text-align: center;
`;

const ContactCardTitle = styled(Typography)`
  color: #333;
  font-weight: 600;
  margin-top: 1rem;
`;

const ContactCardText = styled(Typography)`
  color: #687188;
  line-height: 28px;
`;

const ContactCard = ({ icon, title, content }) => (
  <StyledCard>
    <ContactCardContent>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconWrapper>{icon}</IconWrapper>
        <ContactCardTitle variant="h6">{title}</ContactCardTitle>
        <ContactCardText variant="body2">{content}</ContactCardText>
      </Box>
    </ContactCardContent>
  </StyledCard>
);

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const contactEnquiry = async (values, { resetForm }) => {
   
    try {
      setLoading(true);
      const response = await contactApi.contactEnquire(values);
  

      if (response.status === 200) {
        showToast("success", response.message);
        resetForm();
      }
    } catch (error) {
      showToast("error", "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer container spacing={4}>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <h4 className="text-2xl font-bold text-gray-900 mb-2">
          {t("get_in_touch")}
        </h4>
        <h6 className="text-lg text-gray-600 mb-6">
          {t("contact_us_description")}
        </h6>

        <Formik
          initialValues={{ name: "", email: "", phone: "", message: "" }}
          validationSchema={validationSchema}
          onSubmit={contactEnquiry}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {[
                  { item: "name", label: t("enter_your_name") },
                  { item: "email", label: t("email") },
                  { item: "phone", label: t("phone") },
                  { item: "message", label: t("enter_your_message") },
                ]?.map((field, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <TextField
                      name={field.item}
                      placeholder={field.label}
                      fullWidth
                      value={values[field.item]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched[field.item] && Boolean(errors[field.item])}
                      helperText={touched[field.item] && errors[field.item]}
                    />
                  </Grid>
                ))}

                <Grid size={12}>
                  <StyledButton type="submit">
                    {loading ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "white",
                        }}
                      >
                        <CircularProgress color="inherit" size={24} />{" "}
                        {t("loading")}
                      </Box>
                    ) : (
                      t("send_message")
                    )}
                  </StyledButton>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <ContactCardContainer className="contact-box">
          <ContactCard
            icon={<Email fontSize="large" />}
            title="Email Address"
            content="contact@alsaadhome.com"
          />
          <ContactCard
            icon={<Phone fontSize="large" />}
            title="Phone"
            content="+971523509471"
          />
        </ContactCardContainer>
      </Grid>
    </FormContainer>
  );
};

export default ContactForm;
