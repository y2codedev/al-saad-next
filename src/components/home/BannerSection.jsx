import React from "react";
import BannerSectionShimer from "../skeleton/BannerSectionShimer";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Container } from "@mui/material";

const BannerSection = ({ bannerSection, isLoading }) => {
  if (isLoading) {
    return <BannerSectionShimer />;
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 1 }}>
      <div className="flex flex-col sm:flex-row sm:gap-4 ">
        {bannerSection?.slice(0, 2)?.map((item) => (
          <div key={item.id} className="w-full sm:w-1/2 my-3 sm:my-5">
            <Link
              href={`/search/display_banners/${item?.id}`}
              className="text-[#292b2c] no-underline"
            >
              <div className="relative w-full aspect-[9/5] overflow-hidden transition-all duration-300 ease-in-out hover:brightness-110 hover:contrast-110 hover:saturate-150">
                <Image
                  src={item.image}
                  alt={item.banner_name}
                  className="object-cover"
                  fill
                  quality={100}
                  loading="lazy"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default BannerSection;
