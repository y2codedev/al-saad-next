"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Link } from "@/i18n/navigation";
import { ProductTitle, Tag } from "@/components/styles";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const BlogSideBar = ({ data }) => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const [searchByTitle, setSearchByTitle] = useState("");
  const searchParams = useSearchParams();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedKeyword = searchByTitle?.trim();
    const params = new URLSearchParams(window.location.search);
    if (trimmedKeyword) {
      params.set("keyword", trimmedKeyword.toLowerCase());
    } else {
      params.delete("keyword");
    }

    router.push(`/blog/?${params.toString()}`);
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword");
    if (keyword) {
      setSearchByTitle(keyword);
    }
  }, [searchParams]);

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      {/* Search Box */}
      <Box mb={4}>
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
        >
          <InputBase
            value={searchByTitle}
            onChange={(e) => setSearchByTitle(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
            placeholder={t("search")}
            inputProps={{ "aria-label": "search..." }}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Recent Posts */}
      <Divider />
      <Typography variant="h6" mt={2}>
        {t("recent_post")}
      </Typography>
      <List>
        {data?.recent_blogs?.length > 0 &&
          data?.recent_blogs?.map((post) => (
            <Box
              key={post?.id}
              sx={{ display: "flex", gap: 2, my: 2, alignItems: "center" }}
            >
              <Image
                src={post?.image}
                alt={post?.title_blog}
                width={80}
                height={70}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 80px"
                // style={{ width: "100%", height: "auto", objectFit: "cover" }}
                blurDataURL={post?.image}
              />
              <Box>
                <Link href={`/blog/${post?.slug}`} passHref>
                  <ProductTitle fontSize="14px" fontWeight="0">
                    {post?.title_blog}
                  </ProductTitle>
                </Link>
                <Typography sx={{ fontSize: "14px", color: "#687188" }}>
                  {post?.created_at}
                </Typography>
              </Box>
            </Box>
          ))}
      </List>

      {/* Archive */}
      <Divider />
      <Box my={4}>
        <Typography variant="h6" gutterBottom>
          {t("archive")}
        </Typography>
        <List sx={{ padding: "0px !important" }}>
          {data?.archive?.length > 0 &&
            data?.archive?.map((item, index) => {
              const date = new Date(item?.month);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const formattedDate = `${year}-${month}`;

              return (
                <Link
                  href={`/blog/?dates=${formattedDate}`}
                  passHref
                  key={index}
                >
                  <ListItem
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0px !important",
                      my: 1,
                      ":hover": { color: "#bb1f2a" },
                      cursor: "pointer",
                    }}
                  >
                    <KeyboardArrowRightIcon />
                    <ListItemText primary={formattedDate} />
                    <span>({item?.total_blog})</span>
                  </ListItem>
                </Link>
              );
            })}
        </List>
      </Box>

      {/* Tags */}
      <Divider />
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          {t("tags")}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {data?.tags?.length > 0 &&
            data?.tags?.map((tag, index) => (
              <Link href={`/blog/?tag=${tag}`} key={index}>
                <Tag>{tag}</Tag>
              </Link>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BlogSideBar;
