import React from "react";
import { Container, Skeleton } from "@mui/material";

const GridProductsShimmer = () => {
  return (
    <Container maxWidth="lg">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
        {Array(8)
          .fill()
          .map((_, index) => (
            <div key={index} className="bg-white rounded-lg">
              <div className="relative">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={180}
                  sx={{ borderRadius: "8px" }}
                />
              </div>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default GridProductsShimmer;
