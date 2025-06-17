import React from "react";
import { Box, Radio, CardMedia, Icon } from "@mui/material";
import COLORS from "@/utils/colors";
import {
  PaymentMethodContainer,
  PaymentMethodContent,
  PaymentMethodDescription,
  PaymentMethodText,
  PaymentMethodTitle,
  RadioButton,
} from "@/components/styles";
import { PaymentGateway } from "@/utils/helper";
import Image from "next/image";

const PaymentMethodItemCard = ({
  item,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  handlePaymentMethodChange,
}) => {
  const image = PaymentGateway(item.name);
  return (
    <PaymentMethodContainer
      key={item.id}
      onClick={() => handlePaymentMethodChange(item?.id)}
    >
      <PaymentMethodContent>
        <PaymentMethodText>
          <Radio
            checked={selectedPaymentMethod === item?.id}
            onChange={() => setSelectedPaymentMethod(item?.id)}
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
            <PaymentMethodTitle>{item?.name}</PaymentMethodTitle>
            {image?.desc && (
              <PaymentMethodDescription>{image?.desc}</PaymentMethodDescription>
            )}
          </Box>
        </PaymentMethodText>
        {image?.icon && (
          <Image
            src={image?.icon}
            alt={item?.title}
            width={70}
            height={70}
            style={{
              marginTop: "8px",
              objectFit: "contain",
            }}
            loader={({ src }) => {
              return src;
            }}
            loading="lazy"
          />
        )}
      </PaymentMethodContent>
    </PaymentMethodContainer>
  );
};

export default PaymentMethodItemCard;
