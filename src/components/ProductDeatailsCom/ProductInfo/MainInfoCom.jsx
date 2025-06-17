import React from "react";
import { Grid, Box } from "@mui/material";
import ProductTitle from "./ProductTitle";
import PriceAndRating from "./PriceAndRating";
import ColorOptions from "./ColorOptions";
import SizeInfo from "./SizeInfo";
import AvailabilityInfo from "./AvailabilityInfo";
import DeliveryText from "./DeliveryText";
import PaymentOptions from "./PaymentOptions";
import QuantityControl from "./QuantityControl";
import AddToCartActions from "./AddToCartActions";
import ProductInfo from "./ProductInfo";
import ProductFeatures from "./ProductFeatures";
import ProductDetailsTable from "./ProductDetailsTable";

const MainInfoCom = ({ tags, productInfo }) => {
  return (
    <Grid
      sx={{ p: 0 }}
      size={{
        xs: 12,
        md: 6,
      }}
    >
      <Box>
        {console.log("productInfo", productInfo[0].items)};
        {/* <ProductTitle title={product.title} /> */}
        {/* <PriceAndRating product={product} /> */}
        <ColorOptions
          colorOptions={productInfo}
          // selectedColor={selectedColor}
          // setSelectedColor={setSelectedColor}
        />
        {/* <SizeInfo size={product.size} /> */}
        {/* <AvailabilityInfo availability={product.availability} />
        <DeliveryText deliveryText={product.deliveryText} />
        <PaymentOptions paymentText={product.paymentText} /> */}
        {/* <QuantityControl
              count={count}
              incrementChange={incrementChange}
              decrementChange={decrementChange}
            /> */}
        {/* <AddToCartActions /> */}
      </Box>
      <Box>
        <Box>
          <ProductInfo tags={tags} />
          {/* <ProductFeatures features={info.features} />
            <ProductDetailsTable productDetails={info.productDetails} /> */}
        </Box>
      </Box>
    </Grid>
  );
};

export default MainInfoCom;
