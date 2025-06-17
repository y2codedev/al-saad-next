import { Box, Container, Grid } from "@mui/material";
import React from "react";
import BannerSectionShimer from "../skeleton/BannerSectionShimer";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

const BannerSection2 = ({ bannerSection, isLoading }) => {
  if (isLoading) {
    return <BannerSectionShimer />;
  }

  return (
    <Container maxWidth="lg" sx={{ overflow: "hidden" }}>
      <Grid
        container
        spacing={2}
        flexDirection={{
          xs: "column",
          sm: "row",
          overflow: "hidden",
          my: "20px",
        }}
      >
        {bannerSection?.slice(2, 4)?.map((item) => (
          <Grid key={item?.id} size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                overflow: "hidden",
                transition: "transform 0.3s ease",
                transform: "scale(1)",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <Link
                href={`/search/display_banners/${item?.id}`}
                sx={{ textDecoration: "none", color: "#292b2c" }}
              >
                <Image
                  src={item?.image}
                  alt={item?.banner_name}
                  className="object-cover"
                  fill
                  quality={80}
                  loading="lazy"
                />
              </Link>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BannerSection2;
