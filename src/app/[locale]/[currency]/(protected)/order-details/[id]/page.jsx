"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Grid,
  Typography,
  Tab,
  Tabs,
  Box,
  Container,
  Button,
} from "@mui/material";
import AddReviewModal from "@/components/AddReviewModal";
import orderServiceApi from "@/utils/services/oderServices";
import COLORS from "@/utils/colors";
import {
  BreadCumContainer,
  BreadCumHeader,
  DashBox,
  StyledHeading,
} from "@/components/styles";
import Dashboard from "@/components/dashboard/Dashboard";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import { useTranslations } from "next-intl";
import ImagePath from "@/constants/imagepath";
import Image from "next/image";
import FullScreenImageModal from "@/components/FullScreenImageModal";
import { returnOrderStatus } from "@/utils/helper";
import OrderItemCard from "@/components/OrderItemCard";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import { useParams, useRouter } from "next/navigation";

const DeliveryManImage = ({ src, alt = "pending" }) => {
  return (
    <div className="w-[[#687188]px] h-auto relative">
      <Image
        src={src}
        alt={alt}
        objectFit="contain"
        sizes="50px"
        className="object-contain"
      />
    </div>
  );
};

const useStyles = {
  container: {
    boxShadow: "0 0 10px rgb(0 0 0 / 20%)",
  },
  headerBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    p: 3,
  },
  orderInfo: {
    fontSize: "16px",
    fontWeight: "600",
  },
  orderDetail: {
    fontSize: "14px",
    color: "#687188",
  },
  tabs: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    padding: 0,
  },
  tabIndicator: {
    color: COLORS.primary,
    background: COLORS.primary,
    flex: 1,
    // display: 'flex',
  },
  tab: {
    display: "flex",
    flex: 1,
    maxWidth: "100%",
    ":hover": {
      color: COLORS.primary,
    },
  },
  tabActive: {
    color: COLORS.primary,
  },
  tabInactive: {
    color: "#292b2c",
  },
  dashedLine: {
    width: "2px",
    height: "50px",
    borderLeft: "2px dashed #1a5f20",
    marginTop: "8px",
    marginBottom: "8px",
  },
  statusStepContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statusCircle: (status) => ({
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: status === "Delivered" ? "#1a5f20" : "#88a785",
  }),
  statusText: {
    fontWeight: "600",
    fontSize: "18px",
    cursor: "pointer",
  },
  itemContainer: {
    padding: "0.5rem 0.5rem 0.5rem 1.25rem!important",
    mb: 2,
    border: "1px solid rgba(0,0,0,.125)",
    borderRadius: "0.25rem",
  },
  itemImage: {
    borderRadius: "3px",
    objectFit: "cover",
    objectPosition: "top",
    width: "100%",
    minHeight: "100%",
    maxHeight: "100%",
  },
  colorDot: {
    backgroundColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    width: 20,
    height: 20,
  },
  reviewButton: {
    mt: 1,
    ":hover": { color: COLORS.primary },
    cursor: "pointer",
  },
  pricingBox: {
    padding: 2,
  },
  addressSection: {
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: "10px",
  },

  addressBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  addressInfo: {
    fontSize: "15px",
    fontWeight: "600",
    mb: 1,
    color: COLORS.grey,
    flexWrap: "wrap",
  },
  addressDetail: {
    fontSize: "14px",
    mb: 1,
    textAlign: "right",
  },
};

function OrderDetails({}) {
  const params = useParams();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderItemId, setsetOrderItemId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const { id: orderId } = params;

  let initialRating = {
    rating_id: "",
    product_variant_id: "",
  };
  const [ratingID, setratingID] = useState(initialRating);
  const [index, setIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const orderDetails = async () => {
    try {
      setLoading(true);
      const req = {
        order_id: orderId,
      };
      const response = await orderServiceApi.getOrderDetails(req);
      if (response && response.status === 200) {
        setLoading(false);
        setOrder(response.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    orderDetails();
  }, []);

  let status = order?.status || "Pending";
  const steps = ["Pending", "Ready To Ship", "Store Pickup", "Delivered"];

  return (
    <div style={{ marginBottom: 40 }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("order_history")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("order_history"), link: "order_history" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      <Container sx={{ mt: 4, overflow: "hidden" }}>
        <Grid container spacing={2} mt={"10px"} mb={"50px"}>
          <Grid
            size={{
              xs: 12,
              sm: 3,
            }}
          >
            <Box
              sx={{ bgcolor: "white", boxShadow: "0 0 10px rgb(0 0 0 / 20%)" }}
            >
              <Dashboard selectItem={2} />
            </Box>
          </Grid>
          <Grid
            sx={{ mb: { sm: 0, xs: 5 } }}
            size={{
              xs: 12,
              sm: 9,
            }}
          >
            <DashBox
              sx={{ bgcolor: "white", boxShadow: "0 0 10px rgb(0 0 0 / 20%)" }}
            >
              <Box sx={{}}>
                <Box sx={[useStyles.headerBox, { pb: 0 }]}>
                  <Box>
                    <Typography sx={useStyles.orderInfo}>Order Date</Typography>
                    <Typography sx={useStyles.orderDetail}>
                      {order?.order_date}
                    </Typography>
                  </Box>
                  {order?.replace_order_id ? (
                    <Box>
                      <Button
                        variant="contained"
                        sx={{ background: COLORS.primary, color: "#fff" }}
                        onClick={() =>
                          router.push(
                            `/order-details/${order?.replace_order_id}`,
                          )
                        }
                      >
                        Main order
                      </Button>
                    </Box>
                  ) : null}

                  <Box>
                    <Typography sx={useStyles.orderInfo}>Order ID</Typography>
                    <Typography sx={useStyles.orderDetail}>
                      {order?.id}
                    </Typography>
                  </Box>
                </Box>
                <hr className=" text-gray-300 mt-1" />
                {/* Tabs for Order Status and Details */}
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    sx={useStyles.tabs}
                    variant="fullWidth"
                    textColor="#bb1f2a"
                    TabIndicatorProps={{ sx: useStyles.tabIndicator }}
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="order tabs"
                  >
                    <Tab
                      sx={
                        tabValue === 0
                          ? useStyles.tabActive
                          : useStyles.tabInactive
                      }
                      label="Order Status"
                    />
                    <Tab
                      sx={
                        tabValue === 1
                          ? useStyles.tabActive
                          : useStyles.tabInactive
                      }
                      label="Order Details"
                    />
                  </Tabs>
                </Box>
                <Box sx={{ padding: { sm: 3, xs: "8px" } }}>
                  {tabValue === 0 && (
                    <Grid container spacing={3}>
                      <Grid
                        sx={{ display: "flex", gap: 3, alignItems: "center" }}
                        size={12}
                      >
                        {status === "Cancelled" ? (
                          <Box
                            sx={{
                              m: 2,
                              color: "#b00020",
                              fontWeight: "600",
                              display: "block",
                              margin: "20px auto",
                            }}
                          >
                            Order Cancelled
                          </Box>
                        ) : (
                          <>
                            <Box sx={useStyles.statusStepContainer}>
                              {steps.map((step, index) => {
                                let effectiveStatus =
                                  status === "On The Way"
                                    ? "Store Pickup"
                                    : status === "Completed"
                                      ? "Delivered"
                                      : status;
                                const { bgColor, icon } =
                                  returnOrderStatus(step);
                                const currentStatusIndex =
                                  steps.indexOf(effectiveStatus);
                                const isActive = index <= currentStatusIndex;
                                return (
                                  <React.Fragment key={step}>
                                    <Avatar
                                      sx={{
                                        bgcolor: isActive ? bgColor : "#88a785",
                                        width: "30px",
                                        height: "30px",
                                      }}
                                    >
                                      {isActive ? icon : null}
                                    </Avatar>
                                    {index < steps.length - 1 && (
                                      <Box
                                        sx={[
                                          useStyles.dashedLine,
                                          {
                                            borderLeft: isActive
                                              ? "2px dashed #1a5f20"
                                              : "px dashed #88a785",
                                          },
                                        ]}
                                      />
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </Box>

                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="flex-start"
                              gap={3}
                              mt={2}
                            >
                              <Box display="flex" alignItems="center" mb={2}>
                                <DeliveryManImage
                                  src={ImagePath.penddingOrder}
                                />

                                <Box ml={2}>
                                  <Typography variant="body1">
                                    <strong>Pending</strong>
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#687188" }}
                                  >
                                    We have received your order
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Ready to Ship */}
                              <Box display="flex" alignItems="center" mb={2}>
                                <DeliveryManImage src={ImagePath.deliveryMan} />
                                <Box ml={2}>
                                  <Typography variant="body1">
                                    <strong>Order Ready to Ship</strong>
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#687188" }}
                                  >
                                    Order ready to be picked up
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Picked Up */}
                              <Box display="flex" alignItems="center" mb={2}>
                                <DeliveryManImage src={ImagePath.pickupCar} />
                                <Box ml={2}>
                                  <Typography variant="body1">
                                    <strong>Order Picked Up</strong>
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#687188" }}
                                  >
                                    Order is now with the courier
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Delivered */}
                              <Box display="flex" alignItems="center" mb={2}>
                                <DeliveryManImage src={ImagePath.delivery} />

                                <Box ml={2}>
                                  <Typography variant="body1">
                                    <strong>Order Delivered</strong>
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#687188" }}
                                  >
                                    Your {order?.orderID} order is completed!
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}
                  {tabValue === 1 && (
                    <Box>
                      <Grid size={12}>
                        {order?.replacement_item ? (
                          <>
                            <Typography
                              variant="h6"
                              component="h2"
                              gutterBottom
                              sx={{ color: "#696969", fontSize: "18px" }}
                            >
                              Replacement Items
                            </Typography>
                            {order?.replacement_item?.replacement_product?.map(
                              (item, index) => (
                                <OrderItemCard
                                  key={item?.id}
                                  item={item}
                                  index={index}
                                  currency={order?.currency}
                                  useStyles={useStyles}
                                />
                              ),
                            )}
                            <div className="pb-2 pt-2">
                              <OrderSummaryCard
                                title={"Replacement Summary"}
                                // orderNumber={`#${order?.id}`}
                                subTotal={
                                  order?.replacement_item.replacement_sub_total
                                }
                                // discountPercent={order?.replacement_item.replacement_discount}
                                currency={order?.currency}
                                discountAmount={
                                  order?.replacement_item.replacement_discount
                                }
                                tax={order?.replacement_item.replacement_vat}
                                totalPrice={
                                  order?.replacement_item.replacement_total
                                }
                              />
                            </div>
                            <hr className=" text-gray-300 my-4" />
                          </>
                        ) : null}
                        {order?.return_item ? (
                          <>
                            <Typography
                              variant="h6"
                              component="h2"
                              gutterBottom
                              sx={{ color: "#696969", fontSize: "18px" }}
                            >
                              Return Items
                            </Typography>
                            {order?.return_item?.return_product?.map(
                              (item, index) => (
                                <OrderItemCard
                                  key={item?.id}
                                  item={item}
                                  index={index}
                                  currency={order?.currency}
                                  useStyles={useStyles}
                                />
                              ),
                            )}
                            <div className="pb-2 pt-2">
                              <OrderSummaryCard
                                title={"Return Summary"}
                                // orderNumber={`#${order?.id}`}
                                subTotal={order?.return_item.return_sub_total}
                                // discountPercent={order?.return_item.return_discount}

                                discountAmount={
                                  order?.return_item.return_discount
                                }
                                tax={order?.return_item.return_vat}
                                totalPrice={order?.return_item.return_total}
                                currency={order?.currency}
                              />
                            </div>
                            <hr className=" text-gray-300 my-5" />
                          </>
                        ) : null}

                        {order?.item?.length > 0 && (
                          <>
                            <Typography
                              variant="h6"
                              component="h2"
                              gutterBottom
                              sx={{ color: "#696969", fontSize: "18px" }}
                            >
                              {order?.order_type !== "Return Replacement"
                                ? "ITEMS"
                                : "New Order"}
                            </Typography>
                            {order.item.map((item, index) => (
                              <OrderItemCard
                                key={item?.id}
                                item={item}
                                index={index}
                                currency={order?.currency}
                                useStyles={useStyles}
                                onReviewClick={({
                                  rating_id,
                                  product_variant_id,
                                  index,
                                  item_id,
                                }) => {
                                  setratingID({
                                    rating_id,
                                    product_variant_id,
                                  });
                                  setIndex(index);
                                  setsetOrderItemId(item_id);
                                  setOpen(true);
                                }}
                              />
                            ))}
                          </>
                        )}

                        {order?.order_type !== "Return Replacement" ? (
                          <div className="space-y-3 mt-2">
                            <div className="flex justify-between items-center">
                              <span className=" font-semibold">Sub Total</span>
                              <span className="font-semibold">
                                {order?.sub_total} {order?.currency}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="font-semibold">
                                Shipping Rate
                              </span>
                              <span className="font-semibold">
                                {order?.shipping_cost}
                              </span>
                            </div>
                            {Number(order?.gift_amount) > 0 ? (
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    Gift Amount
                                  </span>
                                  <p
                                    onClick={() =>
                                      setIsOpen((pri) => {
                                        return !pri;
                                      })
                                    }
                                    className="text-[#687188] cursor-pointer font-semibold"
                                  >
                                    Preview Gift
                                  </p>
                                </div>

                                <span className="font-semibold">
                                  {order?.gift_amount} {order?.currency}
                                </span>
                              </div>
                            ) : (
                              <></>
                            )}

                            <div className="flex justify-between items-center">
                              <span className=" font-semibold">
                                Cod Processing Fee
                              </span>
                              <span className="font-semibold">
                                {order?.processing_fee} {order?.currency}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <strong className="font-semibold">
                                Final Total
                              </strong>
                              <span className="font-bold">
                                {order?.total} {order?.currency}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-4">
                            <OrderSummaryCard
                              title={"Order Summary"}
                              orderNumber={`#${order?.id}`}
                              totalCredit={order?.total_customer_credit}
                              subTotal={order?.sub_total}
                              discountPercent={order?.discount_percentage}
                              discountCode={order?.applied_coupon}
                              discountAmount={order?.discount_amount}
                              tax={order?.return_item.return_vat}
                              totalPrice={order?.total}
                              currency={order?.currency}
                              shippingCharge={order.shipping_cost}
                            />
                          </div>
                        )}

                        <hr className=" text-gray-300 mt-3" />
                        <Box mt={2}>
                          <Typography
                            sx={useStyles.addressSection}
                            variant="h6"
                          >
                            Delivery Address
                          </Typography>
                          <Box sx={useStyles.addressBox}>
                            <div style={{ flex: 1 }}>
                              <Typography sx={useStyles.addressInfo}>
                                Country
                              </Typography>
                              <Typography sx={useStyles.addressInfo}>
                                City
                              </Typography>
                              <Typography sx={useStyles.addressInfo}>
                                Address
                              </Typography>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "end",
                                flexDirection: "column",
                                flex: 2,
                              }}
                            >
                              <Typography sx={useStyles.addressInfo}>
                                {order?.country_name}
                              </Typography>
                              <Typography sx={useStyles.addressInfo}>
                                {order?.city_name}
                              </Typography>
                              <Typography sx={useStyles.addressInfo}>
                                {order?.address}
                              </Typography>
                            </div>
                          </Box>
                        </Box>
                      </Grid>
                    </Box>
                  )}
                </Box>
                <AddReviewModal
                  open={open}
                  index={index}
                  setOpen={() => {
                    setOpen(false);
                    setsetOrderItemId("");
                    setratingID(initialRating);
                  }}
                  onAdd={(index, id) => {
                    if (id) {
                      let data = { ...order };
                      data.item = [...data.item];
                      data.item[index] = { ...data.item[index], rating_id: id };
                      setOrder(data);
                    }
                  }}
                  orderId={orderItemId}
                  ratingId={ratingID}
                />
              </Box>
            </DashBox>
          </Grid>
        </Grid>
      </Container>
      <FullScreenImageModal
        imageUrl={order?.gift_image || ""}
        onClose={() => setIsOpen(false)}
        isVisible={isOpen}
      />
    </div>
  );
}

export default OrderDetails;
