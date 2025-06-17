import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import parse from "html-react-parser";
import Image from "next/image";

const UnboxingTopSection = ({ item }) => {
  return (
    <Box sx={{ mt: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {item?.name}
        </Typography>
      </Box>
      <Box sx={{ pb: 4 }}>
        <Grid container sx={{ mb: 2 }} spacing={3}>
          {item?.video_image?.map(
            (video) => (
        
              (
                <Grid
                  key={video?.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      boxShadow: 3,
                      borderRadius: 2,
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    <div className="relative w-full">
                      <Image
                        src={video}
                        alt="Video Thumbnail"
                        className="object-cover w-full sm:h-[210px] xs:h-[120px]"
                        loading="lazy"
                        placeholder="empty"
                        sizes="100vw"
                      />
                    </div>
                  </Box>
                </Grid>
              )
            ),
          )}
        </Grid>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "#687188",
                fontSize: "18px",
              }}
            >
              {parse(item?.description)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UnboxingTopSection;
