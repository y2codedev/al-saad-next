"use client";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { keyframes } from "@mui/system";

const NotFoundPage = () => {
  const router = useRouter();

  const bounce = keyframes`
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    60% {
      transform: translateY(-15px);
    }
  `;

  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      bgcolor="#fff"
      textAlign="center"
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "4rem", sm: "6rem" },
          fontWeight: "bold",
          color: "#ba1f2a",
          animation: `${bounce} 2s ease infinite`,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontSize: { xs: "1.2rem", sm: "1.5rem" },
          animation: `${fadeIn} 1s ease`,
        }}
      >
        Oops! The page you're looking for doesn't exist.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => router.push("/")}
        sx={{
          textTransform: "none",
          backgroundColor: "#ba1f2a",
          color: "#fff",
          fontSize: "1rem",
          padding: "0.8rem 1.5rem",
          animation: `${fadeIn} 1.5s ease`,
          "&:hover": {
            transform: "scale(1.05)",
            transition: "transform 0.3s ease",
          },
        }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
