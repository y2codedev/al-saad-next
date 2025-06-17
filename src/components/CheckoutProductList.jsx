// components/CheckoutProductList.js
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { PhotoTitle, ProductTitle } from "./styles";
import COLORS from "@/utils/colors";

const productItemStyle = {
  alignItems: "center",
  marginBottom: 2,
  textAlign: { xs: "center", sm: "left" },
};

const imageStyle = {
  xs: 3,
  sm: 2,
};

const titleStyle = {
  xs: 6,
  sm: 8,
};

const priceStyle = {
  textAlign: "right",
  xs: 3,
  sm: 2,
};

const totalBoxStyle = {
  display: "flex",
  justifyContent: "space-between",
  my: 2,
};

const CheckoutProductList = ({
  items,
  currency,
  isCheckout = true,
  discountData,
  t,
}) => {
  return (
    <>
      <Grid container sx={{ alignItems: "center", padding: 1 }}>
        <Grid
          size={{
            xs: 3,
            sm: 2,
          }}
        >
          <PhotoTitle>{t("photo")}</PhotoTitle>
        </Grid>
        <Grid
          size={{
            xs: 6,
            sm: 8,
          }}
        >
          <PhotoTitle>{t("product")}</PhotoTitle>
        </Grid>
        <Grid
          sx={{ textAlign: "right" }}
          size={{
            xs: 3,
            sm: 2,
          }}
        >
          <PhotoTitle>{t("total")}</PhotoTitle>
        </Grid>
      </Grid>
      <hr className="mb-3 border-t border-gray-300" />
      {items?.map((product, index) => (
        <Grid key={index} container spacing={2} sx={productItemStyle}>
          <Grid size={imageStyle}>
            <Image
              src={product?.image}
              alt="product"
              width={60}
              height={60}
              className="object-cover"
              loading="lazy"
            />
          </Grid>
          <Grid size={titleStyle}>
            <ProductTitle fontWeight="400">{product?.title} &times; {product?.qty || product?.cart_quantity}</ProductTitle>
          </Grid>
          <Grid sx={priceStyle} size={{ xs: 3, sm: 2 }}>
            <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
              {`${product?.list_price} ${currency}`}
            </Typography>
          </Grid>
        </Grid>
      ))}
      {!isCheckout && <hr className="border-gray-300" />}
      <Box sx={totalBoxStyle}>
        <Typography>{t(isCheckout ? "sub_total" : "final_total")}</Typography>
        <Typography>{`${isCheckout ? discountData?.sub_total : discountData?.total_amount} ${currency}`}</Typography>
      </Box>

      {isCheckout && discountData?.convert_shipping_cost && (
        <Box sx={totalBoxStyle}>
          <Typography>{t("flat_shipping_rate")}</Typography>
          <Typography>{`${discountData?.convert_shipping_cost} ${currency}`}</Typography>
        </Box>
      )}

      {isCheckout && discountData?.convert_processing_fees && (
        <Box sx={totalBoxStyle}>
          <Typography>{t("code_processing_fee")}</Typography>
          <Typography>{`${discountData?.convert_processing_fees} ${currency}`}</Typography>
        </Box>
      )}
      {isCheckout && Number(discountData?.gift_amount) > 0 && (
        <Box sx={totalBoxStyle}>
          <Typography>{t("gift_amount")}</Typography>
          <Typography>{`${discountData?.gift_amount} ${currency}`}</Typography>
        </Box>
      )}

      {isCheckout && discountData?.discount_amount > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              my: 1,
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "red" }}>
              {t("discount")}
              <span style={{}}>
                {` (${discountData?.discount_percentage} %)`}
              </span>
              <br />
            </Typography>
            <Typography>
              - {` ${discountData?.discount_amount} ${currency}`}
            </Typography>
          </Box>
        </Box>
      )}

      {isCheckout && discountData?.final_order_total_price && (
        <hr className="border-gray-300" />
      )}

      {isCheckout && (
        <Box sx={totalBoxStyle}>
          <Typography sx={{ fontWeight: 700 }}>{t("final_total")}</Typography>
          <Typography sx={{ fontWeight: 700 }}>
            {`${discountData?.final_order_total_price} ${currency}`}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default CheckoutProductList;
