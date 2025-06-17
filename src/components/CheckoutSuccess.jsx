"use client";
import React from "react";
import { Container, Box, Typography, Button, Card } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useAbsolutePath from "../utils/useAbsolutePath";
import { shippingApi } from "../utils/services/shippingApi";
import COLORS from "../utils/colors";
import useUserStore from "../store/user";
import { userService } from "../utils/services/userServices";
import { encryptData } from "../utils/services/AlsaadRSA";
import { useRouter, useSearchParams } from "next/navigation";

const CheckoutSuccess = () => {
  const navigate = useRouter();
  const getPath = useAbsolutePath();
  const { setUserInfo } = useUserStore();
  const searchParams = useSearchParams();

  const ref = searchParams.get("ref");
  const order_id = searchParams.get("order_id");
  const gateway_transaction_id = searchParams.get("gateway_transaction_id");
  const orderId = searchParams.get("orderId");
  const gateway_order_id = searchParams.get("gateway_order_id");

  // React.useEffect(() => {
  //   if (order_id || !ref) return;
  //   shippingApi.successPayment({ ref: ref }).then(async (res) => {
  //     if (res?.status === 200) {
  //       const { customer_id, order_number } = res.data;
  //       if (customer_id && !useUserStore.getState()?.userInfo) {
  //         const userData = await getUserDetails(customer_id);
  //         if (userData) {
  //          await  setUserInfo(userData);
  //           window.location.href = `success?order_id=${order_number}`;
  //         }
  //       } else {
  //         window.location.href = `success?order_id=${order_number}`;
  //       }
  //     } else {
  //       navigate(getPath("checkout"), { replace: true });
  //     }
  //   });
  // }, [ref, order_id]);

  React.useEffect(() => {
    const processPayment = async () => {
      try {
        let request = {
          ...(orderId && { orderId }),
          ...(gateway_order_id && { gateway_order_id }),
          ...(gateway_transaction_id && { gateway_transaction_id }),
          ...(ref && { ref }),
        };
   
        if (order_id || !ref || !gateway_order_id) return;

        const res = await shippingApi.successPayment(request);
        if (res?.status === 200) {
          const { customer_id, order_number } = res.data;

          if (customer_id && !useUserStore.getState()?.userInfo) {
            
            const userData = await getUserDetails(customer_id);

            if (userData) {
              await setUserInfo(userData);
              window.location.href = `success?order_id=${order_number}`;
            }
          } else {
            window.location.href = `success?order_id=${order_number}`;
          }
        } else {
          navigate.replace("/checkout", { replace: true });
        }
      } catch (error) {
        console.error("Payment processing failed:", error);
      }
    };

    processPayment();
  }, [searchParams]);

  async function getUserDetails(customer_id) {
    try {
      const response = await userService.getUserById({ customer_id });
      if (response?.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
    return null;
  }

  if (!order_id) {
    return <></>;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        pt: "10%",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          boxShadow: 2,
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.primary,
            mb: 2,
            position: "relative",
          }}
        >
          <CheckCircleIcon
            color="success"
            sx={{ fontSize: 50, color: COLORS.white }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {`Your ${order_id} order is completed!`}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your order! Your order is being processed and will be
          completed within 3-6 hours. You will receive an email confirmation
          when your order is completed.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => navigate(getPath(), { replace: true })}
            sx={{ mt: 2 }}
            fullWidth
          >
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            color="error"
            size="large"
            fullWidth
            onClick={() =>
              navigate(getPath(`order-history/${order_id}`), { replace: true })
            }
            sx={{ mt: 2 }}
          >
            View Order
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default CheckoutSuccess;
