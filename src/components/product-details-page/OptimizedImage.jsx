"use client";

import Image from "next/image";

const OptimizedImage = ({
  src,
  alt,
  width = 50,
  height = 30,
  priority = false,
  loading,
  fill = false,
  ...rest
}) => {
  if (!src) return null; 
  return (
    <Image
      src={src}
      alt={alt}
      {...(fill ? { fill: true } : { width, height })}
      priority={priority}
      loading={priority ? undefined : (loading ?? "eager")}
      quality={100}
      sizes={fill ? "100vw" : undefined}
      className={`object-cover ${fill ? "w-full h-full" : ""}`}
      {...(fill ? { style: { objectFit: "cover" } } : {})}
      placeholder="blur"
      blurDataURL="https://cdn.pixabay.com/photo/2016/04/13/16/21/watch-1327169_1280.jpg"
      {...rest}
    />
  );
};

export default OptimizedImage;
