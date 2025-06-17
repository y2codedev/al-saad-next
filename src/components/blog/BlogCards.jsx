"use client";

import { CardContent, Typography, Box, IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  BlogDescription,
  CardWrapper,
  ProductTitle,
} from "@/components/styles";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

const BlogCards = ({ blog }) => {
  return (
    <>
      <CardWrapper sx={{ borderRadius: "10px" }}>
        <Box position="relative">
          <Link href={`blog/${blog?.slug}`} className="link-none">
            <div className="w-full min-h-[233px] max-h-[233px] object-cover transition-transform duration-300 ease-in-out cursor-pointer hover:scale-110">
              <Image src={blog?.image} alt={blog?.title_blog} fill={true} />
            </div>
          </Link>
        </Box>
        <CardContent>
          <ProductTitle variant="h6">{blog?.title_blog}</ProductTitle>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: "16px", color: "gray" }} />
            <Typography variant="body2">{blog?.created_at}</Typography>
            <IconButton
              size="small"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: "16px", color: "gray" }} />
              {blog?.comment_count}
            </IconButton>
          </Box>
          <BlogDescription fontSize="14px">
            {blog?.short_description}
          </BlogDescription>
        </CardContent>
      </CardWrapper>
    </>
  );
};

export default BlogCards;
