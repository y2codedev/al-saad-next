"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container, Card, Typography, Box, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import COLORS from "@/utils/colors";
import { userService } from "@/utils/services/userServices";
import useUserStore from "@/store/user";
import { shippingApi } from "@/utils/services/shippingApi";
import API from "@/utils/services/Endpoints";

const CheckoutSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserInfo } = useUserStore();

  const ref = searchParams.get("ref");
  const order_id = searchParams.get("order_id");
  const gateway_transaction_id = searchParams.get("gateway_transaction_id");
  const orderId = searchParams.get("orderId");
  const gateway_order_id = searchParams.get("gateway_order_id");

  useEffect(() => {
    const processPayment = async () => {
      try {
        let request = {
          ...(orderId && { orderId }),
          ...(gateway_order_id && { gateway_order_id }),
          ...(gateway_transaction_id && { gateway_transaction_id }),
          ...(ref && { ref }),
        };

        const res = await shippingApi.successPayment(
          API.PAYMENT_VALIDATE,
          request,
        );

        if (res?.status === 200) {
          const { customer_id, order_number } = res.data;

          if (customer_id && !useUserStore.getState()?.userInfo) {
            const userData = await getUserDetails(customer_id);

            if (userData) {
              await setUserInfo(userData);
              router.push(`/checkout-success?order_id=${order_number}`);
            }
          } else {
            router.push(`/checkout-success?order_id=${order_number}`);
          }
        } else {
          router.replace("/checkout");
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
    return null;
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
          <CheckCircleIcon sx={{ fontSize: 50, color: COLORS.white }} />
        </Box>

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
            onClick={() => router.push("/")}
            sx={{ mt: 2 }}
            fullWidth
          >
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => router.push(`/order-details/${order_id}`)}
            sx={{ mt: 2 }}
            fullWidth
          >
            View Order
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default CheckoutSuccess;
