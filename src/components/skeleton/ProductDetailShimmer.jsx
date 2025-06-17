import React from "react";
import styled from "styled-components";
import {
  Box,
  Card,
  Skeleton,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Wrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Section = styled(Box)`
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    width: 50%;
  }
`;

const ThumbnailContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
`;

const DetailsContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (min-width: 768px) {
    padding-left: 20px;
  }
`;

const ActionContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
`;

const ProductDetailShimmer = ({ isEng = false }) => (
  <Wrapper maxWidth="lg">
    <Section>
      <Card
        sx={{ width: "100%", height: 480, position: "relative", boxShadow: 0 }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Card>
      <ThumbnailContainer>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width="100%"
            height={80}
            sx={{ borderRadius: "4px" }}
          />
        ))}
      </ThumbnailContainer>
    </Section>

    <DetailsContainer>
      {["100%", "50%", "80%", "40%"].map((width, index) => (
        <Skeleton key={index} width={width} />
      ))}

      {!isEng && (
        <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="circular" width={30} height={30} />
          ))}
        </Box>
      )}

      <ActionContainer>
        <Skeleton variant="rectangular" width={100} height={40} />
        <Button variant="contained" color="error" disabled>
          <Skeleton width={150} height={40} />
        </Button>
        <IconButton disabled>
          <FavoriteBorderIcon />
        </IconButton>
      </ActionContainer>

      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} width={`${50 + index * 10}%`} />
      ))}

      {[...Array(2)].map((_, i) => (
        <Box key={i} sx={{ my: i === 0 ? 4 : 1 }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              width={
                ["100%", "50%", "80%", "40%", "50%", "80%", "40%", "50%"][index]
              }
              height={index === 0 && i === 1 ? 100 : undefined}
            />
          ))}
        </Box>
      ))}
    </DetailsContainer>
  </Wrapper>
);

export default ProductDetailShimmer;
