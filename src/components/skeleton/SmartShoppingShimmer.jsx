import { Skeleton, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const ShimmerContainer = styled(Container)({
  marginTop: "40px",
  marginBottom: "40px",
});

const ShimmerProduct = styled(Skeleton)({
  width: "100%",
  height: "200px",
  backgroundColor: "#EEF0F1",
  borderRadius: "10px",
});

export default function SmartShoppingShimmer() {
  return (
    <ShimmerContainer>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        <Skeleton width="250px" height={30} />
      </Typography>
      <Grid container spacing={2}>
        {[...Array(3)].map((_, i) => (
          <Grid
            key={i}
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <ShimmerProduct variant="rectangular" animation="wave" />
          </Grid>
        ))}
      </Grid>
    </ShimmerContainer>
  );
}
