import React from "react";
import { Box, Breadcrumbs, Container, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink, useLocation } from "react-router-dom";

const BreadcrumbsProductDetails = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <Box sx={{ bgcolor: "#f7f8fb" }}>
      <Container>
        <Box
          sx={{
            display: { xs: "block", sm: "flex" },
            justifyContent: "space-between",
            alignItems: "center",
            py: "30px",
            px: "14px",
            fontFamily: "Roboto",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#292b2c",
              textTransform: "capitalize",
              fontWeight: "700",
              fontSize: { sm: "24px", xs: "16px" },
            }}
          >
            Product Detail
          </Typography>
          <Breadcrumbs
            sx={{ cursor: "pointer", fontSize: "14px" }}
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <RouterLink
              className="breadcrumbs-hover"
              style={{
                color: "#292b2c",
                textDecoration: "none",
                textTransform: "capitalize",
              }}
              to="/"
            >
              Home
            </RouterLink>
            {pathnames.map((segment, index) => {
              const path = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;

              return isLast ? (
                <span
                  key={index}
                  style={{ color: "#6c757d", textTransform: "capitalize" }}
                >
                  {decodeURIComponent(segment)}
                </span>
              ) : (
                <RouterLink
                  key={index}
                  className="breadcrumbs-hover"
                  style={{
                    color: "#292b2c",
                    textDecoration: "none",
                    textTransform: "capitalize",
                  }}
                  to={path}
                >
                  {decodeURIComponent(segment)}
                </RouterLink>
              );
            })}
          </Breadcrumbs>
        </Box>
      </Container>
    </Box>
  );
};

export default BreadcrumbsProductDetails;
