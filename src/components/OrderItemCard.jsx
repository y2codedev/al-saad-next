"use client";

import { Box, Grid, Typography } from "@mui/material";
import Link from "next/link";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

export default function OrderItemCard({
  item,
  currency,
  index,
  useStyles,
  onReviewClick,
}) {
  const {
    id,
    image,
    product_name,
    product_id,
    product_variant_id,
    colors,
    pattern_image,
    qty,
    size,
    price,
    modal_number,
    rating_id,
  } = item;

  return (
    <Box key={id} sx={[useStyles.itemContainer]}>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 4 }}>
          <img
            src={image}
            alt="Item"
            className="rounded-sm object-cover object-top w-full"
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 8 }}>
          {/* Product Name */}
          <Link
            className="link-none"
            href={`/products/${product_name}?product_id=${product_id}&variant_id=${product_variant_id}`}
          >
            <Typography
              sx={{
                ...useStyles.statusText,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              variant="h6"
              component="h3"
              className="text-dark"
            >
              {product_name}
            </Typography>
          </Link>

          {/* Color / Pattern & Quantity */}
          <div className="flex flex-col md:flex-row justify-between w-full">
            <div className="mt-1.5 flex-[0.7] flex items-center">
              <strong className="text-gray-500 mr-2">Colors:</strong>
              {colors?.length > 0 ? (
                colors.map((color, i) => (
                  <span
                    key={i}
                    className="inline-block rounded-full me-2"
                    style={{ backgroundColor: color, width: 20, height: 20 }}
                  />
                ))
              ) : (
                <img
                  src={pattern_image}
                  alt="pattern_image"
                  className="rounded-full w-[25px] h-[25px] object-cover"
                />
              )}
            </div>
            <p className="mt-1.5 flex-[0.3] text-base">
              <strong className="text-gray-500 font-bold">
                Quantity:
                <span className="ms-2 text-[#bb1f2a] font-semibold">{qty}</span>
              </strong>
            </p>
          </div>

          {/* Size & Price */}
          <div className="flex flex-col md:flex-row justify-between w-full">
            <p className="mt-1.5 flex-[0.7] text-base">
              <strong className="text-gray-500">Size:</strong>
              <span className="ms-2 text-[#bb1f2a] font-semibold">{size}</span>
            </p>
            <p className="mt-1.5 flex-[0.3] text-base flex flex-nowrap">
              <strong className="text-gray-500 flex flex-wrap">
                Price ({currency}) :
              </strong>
              <span className="ms-2 text-[#bb1f2a] font-semibold">{price}</span>
            </p>
          </div>

          {/* Modal */}
          <p className="mt-1.5 text-base">
            <strong className="text-gray-500">Modal:</strong>
            <span className="ms-2 text-[#bb1f2a] font-semibold">
              {modal_number}
            </span>
          </p>
          {item?.replacement_qty > 0 && (
            <p className="mt-1.5 text-base">
              <strong className="text-gray-500">Replacement Qty : </strong>
              <span className="ms-2 text-[#bb1f2a] font-semibold">
                {item.replacement_qty}
              </span>
            </p>
          )}
          {item?.reason && (
            <p className="mt-1.5 text-base">
              <strong className="text-gray-500">Reason :</strong>
              <span className="ms-2 text-[#bb1f2a] font-semibold">
                {item.reason}
              </span>
            </p>
          )}

          {item?.description && (
            <p className="mt-1.5 text-base">
              <strong className="text-gray-500">
                Replacement Description :
              </strong>
              <span className="ms-2 text-[#bb1f2a] font-semibold">
                {item.description}
              </span>
            </p>
          )}

          {/* Rating & Review */}
          {onReviewClick && (
            <Typography
              onClick={() =>
                onReviewClick({
                  rating_id,
                  product_variant_id,
                  index,
                  item_id: id,
                })
              }
              color="#222425"
              sx={useStyles.reviewButton}
              className="mt-2"
            >
              <StarBorderOutlinedIcon sx={{ fontSize: "18px" }} />
              {rating_id ? "Edit Rating and Review" : "Give Rating and Review"}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
