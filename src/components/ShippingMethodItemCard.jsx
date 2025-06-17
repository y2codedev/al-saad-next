import React from "react";
import { Box, Radio, CardMedia } from "@mui/material";
import {
  PaymentMethodContainer,
  PaymentMethodContent,
  PaymentMethodDescription,
  PaymentMethodText,
  PaymentMethodTitle,
} from "@/components/styles";
import COLORS from "@/utils/colors";
import Image from "next/image";

const ShippingMethodItemCard = ({
  item,
  selectedShippingMethod,
  handleShippingMethodChange,
}) => {
  return (
    <PaymentMethodContainer
      key={item?.id}
      onClick={() => handleShippingMethodChange(item?.id)}
      style={{ marginBottom: "0px" }}
    >
      <PaymentMethodContent>
        <PaymentMethodText>
          <Radio
            checked={selectedShippingMethod === item?.id}
            value={item?.id}
            sx={{
              width: 20,
              height: 20,
              mr: 1,
              mt: "2px",
              color: "grey",
              "&.Mui-checked": {
                color: COLORS.primary,
              },
            }}
          />
          <Box>
            <PaymentMethodTitle>{item?.title}</PaymentMethodTitle>
            {item?.description && (
              <PaymentMethodDescription
                style={{
                  color: "#ffcb00",
                  lineHeight: "20px",
                  marginTop: "5px",
                }}
              >
                {`${item?.description} ${item?.price}`}
              </PaymentMethodDescription>
            )}
          </Box>
        </PaymentMethodText>

        <div className="relative w-[105px] h-[90px] mt-1 sm:mt-0">
          <Image
            src={item?.imageUrl || "/placeholder.png"}
            alt={item?.title || "Image"}
            fill
            className="object-contain"
            loading="lazy"
            sizes="100px"
          />
        </div>
      </PaymentMethodContent>
    </PaymentMethodContainer>
  );
};

export default ShippingMethodItemCard;
