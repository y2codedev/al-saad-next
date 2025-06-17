import { Skeleton, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const ShimmerContainer = styled(Container)({
  marginTop: "40px",
  marginBottom: "40px",
});

const ShimmerBox = styled("div")(({ theme }) => ({
  backgroundColor: "#EEF0F1",
  borderRadius: "10px",
  width: "100%",
  height: "500px",
  [theme.breakpoints.down("sm")]: {
    height: "200px",
  },
}));

const ShimmerSkeleton = styled(Skeleton)({
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  backgroundColor: "#EEF0F1",
});

const ShimmerTextSkeleton = styled(Skeleton)({
  backgroundColor: "#EEF0F1",
});

export default function UnboxingShimmer() {
  return (
    <ShimmerContainer>
      <ShimmerBox>
        <ShimmerSkeleton variant="rectangular" animation="wave" />
      </ShimmerBox>
      <Typography variant="h5" sx={{ mt: 2 }}>
        <ShimmerTextSkeleton width="50%" height={30} />
      </Typography>
      <Typography variant="body1">
        <ShimmerTextSkeleton width="100%" height={20} />
        <ShimmerTextSkeleton width="80%" height={20} />
        <ShimmerTextSkeleton width="60%" height={20} />
      </Typography>
    </ShimmerContainer>
  );
}
