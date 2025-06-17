"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Grid, Container, Box } from "@mui/material";
import dynamic from "next/dynamic";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  StyledHeading,
} from "@/components/styles";
import { useTranslations } from "next-intl";
import BlogDetailsShimmer from "@/components/skeleton/BlogDetailsShimmer";
import BlogSideBarShimmer from "@/components/skeleton/BlogSideBarShimmer";
import { useMemo } from "react";
const BlogSideBar = dynamic(() => import("@/components/blog/BlogSideBar"), {
  ssr: false,
  loading: () => <BlogSideBarShimmer />,
});
const BlogDetailsCard = dynamic(
  () => import("@/components/blog/BlogDetailsCard"),
  { ssr: false, loading: () => <BlogDetailsShimmer /> },
);
const BlogDetailsPage = ({ blog }) => {
  const memoizedBlog = useMemo(() => blog, [blog]);
  const [searchByTitle, setSearchByTitle] = useState(null);

  const t = useTranslations();

  if (!blog?.data?.blogs) {
    return <p>Blog details not found.</p>;
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("blog")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { link: "/blog", text: t("blog") },
                { link: "", text: t("blog_details") },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      <Container maxWidth="lg" sx={{ py: 5, overflow: "hidden" }}>
        <Grid
          container
          spacing={4}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Suspense fallback={<BlogSideBarShimmer />}>
              <BlogSideBar
                data={memoizedBlog?.data}
                setSearchByTitle={setSearchByTitle}
              />
            </Suspense>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 9,
            }}
          >
            <Suspense fallback={<BlogDetailsShimmer />}>
              <BlogDetailsCard blog={memoizedBlog} />
            </Suspense>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogDetailsPage;
