"use client";
import { Skeleton, Box } from "@mui/material";
const SidebarShimmer = () => {
  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={50}
        sx={{ mb: 2, background: "#EEF0F1" }}
      />
      <Skeleton
        variant="text"
        width="20%"
        height={30}
        sx={{ mt: 6, background: "#EEF0F1" }}
      />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={50}
        sx={{ mb: 2, background: "#EEF0F1" }}
      />
      <Skeleton
        variant="text"
        width="20%"
        height={30}
        sx={{ mt: 1, background: "#EEF0F1" }}
      />
      <Box
        flexDirection={"row"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Skeleton
          variant="rectangular"
          width="45%"
          height={50}
          sx={{ mb: 2, background: "#EEF0F1" }}
        />
        <Skeleton
          variant="rectangular"
          width="45%"
          height={50}
          sx={{ mb: 2, background: "#EEF0F1" }}
        />
      </Box>
      <Box
        flexDirection={"row"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Skeleton
          variant="text"
          width="30%"
          height={30}
          sx={{ background: "#EEF0F1" }}
        />
        <Skeleton
          variant="circular"
          width="15%"
          height={20}
          sx={{ background: "#EEF0F1" }}
        />
        <Skeleton
          variant="text"
          width="30%"
          height={30}
          sx={{ background: "#EEF0F1" }}
        />
      </Box>
      <Skeleton
        variant="text"
        width="40%"
        height={30}
        sx={{ mt: 6, background: "#EEF0F1" }}
      />
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width="70px"
            height={40}
            sx={{ background: "#EEF0F1", mr: 1 }}
          />
        ))}
      </Box>
      <Skeleton
        variant="text"
        width="40%"
        height={30}
        sx={{ mt: 6, background: "#EEF0F1" }}
      />
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width="70px"
            height={40}
            sx={{ background: "#EEF0F1", mr: 1 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SidebarShimmer;
