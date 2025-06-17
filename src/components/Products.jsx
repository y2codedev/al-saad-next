import { Box, Container, Grid } from "@mui/material";
import React from "react";
import { Link } from "../i18n/navigation";
import useAbsolutePath from "../utils/useAbsolutePath";

const Products = ({ products }) => {
  const getPath = useAbsolutePath();
  return (
    <div className="my-5">
      <Container maxWidth="lg" sx={{ px: 2 }}>
        <Grid container spacing={2}>
          {products &&
            products?.map((product, index) => (
              <Grid
                sx={{ cursor: "pointer" }}
                key={index}
                size={{
                  xs: 6,
                  sm: 6,
                  md: 3,
                }}
              >
                <Box
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Link
                    className="link-none"
                    href={getPath(`products/${product?.product_slug}`)}
                  >
                    <Box
                      component={"img"}
                      sx={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                      src={product?.image}
                      alt="product-image"
                      loading="lazy"
                    />
                  </Link>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Products;
