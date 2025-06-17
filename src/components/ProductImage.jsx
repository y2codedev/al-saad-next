import { useState } from "react";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
const ProductImage = ({ item, heightClass, isSmall, search, rating }) => {
  // const [currentSrc, setCurrentSrc] = useState(item?.[0] || item?.image);
  // const handleMouseOver = () => {
  //     if (item?.length > 1) {
  //         setCurrentSrc(item?.[1]);
  //     }
  // };

  // const handleMouseOut = () => {
  //     setCurrentSrc(item?.[0] || item?.image);
  // };

  return (
    <div
      className={`relative w-full overflow-hidden ${heightClass ? heightClass : isSmall ? "min-h-[150px] max-h-[175px]" : "min-h-[200.37px] max-h-[276.37px]"}`}
    >
      <Image
        src={item}
        fill={true}
        alt={item}
        // onMouseOver={handleMouseOver}
        // onMouseOut={handleMouseOut}
        style={{ objectFit: "cover", aspectRatio: 4 / 3 }}
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      {search && Number(rating) > 0 ? (
        <div className="absolute bottom-2 left-2 bg-[rgba(0,0,0,0.5)] bg-opacity-60 text-white text-sm px-[8px] py-[2px] rounded-xl flex items-center gap-1 z-10">
          <AiFillStar size={12} className="text-yellow-400 text-base" />
          <span className="text-[14px]">{rating}</span>{" "}
          {/* replace with dynamic rating */}
        </div>
      ) : null}
    </div>
  );
};

export default ProductImage;
