"use client";

import React from "react";
import OptimizedImage from "./OptimizedImage";

const paymentMethod = [
    {
        id: 1,
        src: "https://cdn.keepconverting.ai/Blu/Icons/Paymentsaccepted/visa.png",
        alt: "Visa",
    },
    {
        id: 2,
        src: "https://cdn.keepconverting.ai/Blu/Icons/Paymentsaccepted/mc-logo-52.svg",
        alt: "Mastercard",
    },
    {
        id: 3,
        src: "https://cdn.keepconverting.ai/Blu/Icons/Paymentsaccepted/tabby.png",
        alt: "Tabby",
    },
];

const PaymentMethods = () => (
    <div className="flex w-full items-center justify-center gap-4 mt-2">
        {paymentMethod?.map((item) => (
            <OptimizedImage
                key={item.id}
                src={item.src}
                alt={item.alt}
                width={40}
                height={40}
            />
        ))}
    </div>
);

export default PaymentMethods;