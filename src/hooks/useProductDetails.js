"use client";

import { useCallback, useEffect, useState } from "react";
import { homeApi } from "@/utils/services/homeServices";

export const useProductDetails = (productId, variantId, customerId) => {
    const [allVariants, setAllVariants] = useState([]);
    const [selectedProductInfo, setSelectedProductInfo] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState([])
    const [details, setDetails] = useState(null);

    const fetchProductDetails = useCallback(async () => {
        if (!productId || !variantId) return;

        setLoading(true);
        try {
            const res = await homeApi.getProductDetails(
                {
                    customer_id: customerId,
                    product_id: productId,
                    variant_id: variantId,
                },
                false
            );

            if (res?.status === 200) {
                const variants = res.data?.variants || [];
                setAllVariants(variants);
                setProductData(variants)

                const flatItems = variants.flatMap((v) => v.items || []);
                const match = flatItems.find(
                    (item) => item?.variant_id?.toString() === variantId.toString()
                );

                if (match) {
                    const index = variants.findIndex((v) =>
                        v.items.some((i) => i.variant_id === match.variant_id)
                    );

                    setSizes(variants[index]?.sizes || []);
                    setSelectedProductInfo(match);
                    setSelectedImage(match?.photo?.[0]?.src || "");
                    setDetails(res.data?.product_details);
                }
            }
        } catch (err) {
            console.error("Error fetching product:", err);
        } finally {
            setLoading(false);
        }
    }, [productId, variantId, customerId]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    return {
        loading,
        sizes,
        allVariants,
        selectedImage,
        setSelectedImage,
        selectedProductInfo,
        productData,
        details,
    };
};
