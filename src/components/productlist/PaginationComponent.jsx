"use client";

import { useTheme } from "@emotion/react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Pagination, PaginationItem } from "@mui/material";
import { useParams } from "next/navigation";

export const PaginationComponent = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const params = useParams();
  return (
    <Box
      sx={{
        my: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        shape="rounded"
        size="small"
        variant="outlined"
        renderItem={(item) => (
          <PaginationItem
            components={{
              previous: (props) => (
                <KeyboardArrowLeft
                  {...props}
                  sx={{
                    transform:
                      params.locale === "ar" ? "rotate(180deg)" : "none",
                  }}
                />
              ),
              next: (props) => (
                <KeyboardArrowRight
                  {...props}
                  sx={{
                    transform:
                      params.locale === "ar" ? "rotate(180deg)" : "none",
                  }}
                />
              ),
            }}
            {...item}
          />
        )}
        sx={{
          "& .MuiPaginationItem-root": {
            "&.Mui-selected": {
              backgroundColor: "#bb1f2a",
              color: "#fff",
              "&:hover": { backgroundColor: "#a91c26" },
            },
          },
        }}
      />
    </Box>
  );
};
