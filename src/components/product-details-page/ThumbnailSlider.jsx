"use client";
import React from "react";
import Slider from "react-slick";
import OptimizedImage from "./OptimizedImage";

const ThumbnailSlider = ({ images, selectImage, onImageClick }) => {

    const settings = {
        dots: images.length > 1,
        infinite: false,
        speed: 500,
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    centerMode: images.length > 1,
                },
            },
            {
                breakpoint: 320,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: images.length > 1,
                },
            },
        ],
    };

    return (
        <div className="sm:mt-8 mt-4 w-full">
            <Slider {...settings}>
                {images &&
                    images?.map((item) => (
                        <div key={item?.id} className="flex gap-2 items-center justify-center">
                            <div
                                onClick={() => onImageClick?.(item?.src)}
                                className={`relative cursor-pointer rounded overflow-hidden border-2 
                                     w-14 sm:w-28 md:w-28 lg:w-36 
                                    sm:h-28 md:h-32 lg:h-36 h-14 ${selectImage === item?.src ? "border-[#bb1f2a]" : "border-white"} `}
                            >
                                <OptimizedImage
                                    src={item?.src}
                                    alt={`Preview ${item?.id}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    ))}
            </Slider>
        </div>
    );
};

export default ThumbnailSlider;
