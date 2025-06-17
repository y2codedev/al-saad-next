import React from "react";
import { Container } from "@mui/material";
import GridProductsShimmer from "../skeleton/GridProductsShimmer";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useParams } from "next/navigation";
const GridProducts = ({ item }) => {
  const params = useParams();

  if (!item) {
    return <GridProductsShimmer />;
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 1 }}>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
        {item?.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
          >
            <div className="relative">
              <Link
                locale={params.locale}
                href={`/products/${item?.product_slug}?product_id=${item?.product_id?.toString()}&variant_id=${item?.varaint_id?.toString()}`}
                className="block"
              >
                <div className="w-full h-[160px] sm:h-[180px] relative aspect-[3/1] sm:aspect-[4/1]">
                  <Image
                    src={item?.image}
                    alt={item?.product_slug || "product"}
                    fill={true}
                    className="object-cover rounded-md"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default GridProducts;
