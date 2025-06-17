"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import ContactCard from "@/components/contact/ContactCard";
import ContactForm from "@/components/contact/ContactForm";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  StyledHeading,
} from "@/components/styles";
import { shippingApi } from "@/utils/services/shippingApi";
import { useTranslations } from "next-intl";

const Contact = () => {
  const [data, setData] = useState([]);
  const [selectedMapUrl, setSelectedMapUrl] = useState("");
  const t = useTranslations();

  const getLocations = async () => {
    try {
      const response = await shippingApi.getStoreLoactions();
      if (response && response.status === 200) {
        setData(response?.data);
        if (response?.data.length > 0) {
          setSelectedMapUrl(response?.data[0].map_url);
        }
      }
    } catch (error) {
      console.log(error, "error in get locations");
    }
  };

  const myElementRef = useRef(null);

  const handleScroll = () => {
    if (myElementRef.current) {
      myElementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  return (
    <>
      <div style={{ width: "100%", minHeight: "100vh" }}>
        <BreadCumContainer>
          <Container>
            <BreadCumHeader>
              <StyledHeading>{t("contect_us")}</StyledHeading>
              <BreadcrumbsComponent
                pathSegments={[
                  { link: "/", text: t("home") },
                  { text: t("contect_us"), link: "contact" },
                ]}
              />
            </BreadCumHeader>
          </Container>
        </BreadCumContainer>

        <Container maxWidth="lg" sx={{ py: 5, px: 1, overflow: "hidden" }}>
          <Grid container spacing={4}>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Grid container spacing={3}>
                {data?.length > 0 &&
                  data?.map((item) => (
                    <Grid key={item?.id} size={12}>
                      <div
                        onClick={() => {
                          handleScroll();
                          setSelectedMapUrl(item?.map_url);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <ContactCard
                          location={item}
                          selectedMapUrl={selectedMapUrl}
                        />
                      </div>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box sx={{ height: "100%", width: "100%" }}>
                <iframe
                  src={selectedMapUrl}
                  ref={myElementRef}
                  id="myElement"
                  style={{ border: 0, width: "100%", height: "640px" }}
                  allowFullScreen
                  loading="lazy"
                  title="Google Maps"
                />
              </Box>
            </Grid>
          </Grid>

          <Box my={5}>
            <ContactForm />
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Contact;
