"use client";

import React, { useState, useEffect } from "react";
import {
  CardContent,
  Typography,
  Box,
  Grid,
  IconButton,
  useMediaQuery,
  Container,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { homeApi } from "@/utils/services/homeServices";
import {
  BlogDescription,
  BlogTopDes,
  CardWrapper,
  ProductTitle,
  SectionTitle,
} from "../styles";
import { useTheme } from "@emotion/react";
import { useTranslations } from "next-intl";
import HomeBlogShimmer from "../skeleton/HomeBlogShimmer";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useParams } from "next/navigation";

const BlogCard = () => {
  const t = useTranslations();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const [blog, setBlog] = useState(null);
  const params = useParams();
  useEffect(() => {
    const fetchHomeBlogData = async () => {
      try {
        const response = await homeApi.getHomeBlogData();
        setBlog(response.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };

    fetchHomeBlogData();
  }, []);

  if (!blog) {
    return <HomeBlogShimmer />;
  }

  return (
    <div className="my-5">
      <Container sx={{ px: 1 }} maxWidth="lg">
        <SectionTitle variant="h5">{t("blog")}</SectionTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <BlogTopDes variant="body1">{t("blog_sub_title")}</BlogTopDes>
        </Box>
        <Grid container justifyContent="center">
          {blog &&
            blog?.map((blog) => (
              <Grid
                key={blog?.id}
                mb={3}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Link
                  locale={params.locale}
                  href={`/blog/${blog?.slug}`}
                  className="link-none"
                >
                  <CardWrapper>
                    <div className="relative w-full overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-105 max-h-[233px] min-h-[180px] sm:min-h-[220px]">
                      <Image
                        src={blog?.image}
                        alt={blog?.title_blog || "blog"}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={blog?.image}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                    <CardContent>
                      <ProductTitle variant="h5">
                        {blog?.title_blog}
                      </ProductTitle>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          gap: 1,
                        }}
                      >
                        <CalendarTodayIcon
                          sx={{ fontSize: "16px", color: "gray" }}
                        />
                        <Typography variant="body2">
                          {blog?.created_at}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <ChatBubbleOutlineIcon
                            sx={{ fontSize: "16px", color: "gray" }}
                          />
                          {blog?.comment_count}
                        </IconButton>
                      </Box>
                      <BlogDescription variant="body2">
                        {blog?.short_description}
                      </BlogDescription>
                    </CardContent>
                  </CardWrapper>
                </Link>
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  );
};

export default BlogCard;
