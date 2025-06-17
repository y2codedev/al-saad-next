import useUserStore from "@/store/user";
import ratingApi from "@/utils/services/ratingServices";
import { useState, useEffect, useCallback } from "react";

export function useReviewList(productId, variantId) {
    const [ratingData, setRatingData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReviewList = useCallback(
        async (page = 1) => {
            if (!productId || !variantId) return null
            setLoading(true);
            setError(null);

            try {
                const reqBody = {
                    page: page ?? currentPage,
                    product_id: productId,
                    customer_id: useUserStore.getState().userInfo?.id || "",
                    product_variant_id: variantId,
                };
                const res = await ratingApi.getRatingReview(reqBody);
                if (res && res.status === 200) {
                    setRatingData(res.data);
                    setTotalPages(res?.totalReviews || 0);
                    setCurrentPage(page);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        },
        [productId, variantId]
    );

    const onPageChange = (page) => {
        fetchReviewList(page);
    };

    useEffect(() => {
        fetchReviewList(1);
    }, [fetchReviewList]);

    return {
        ratingData,
        totalPages,
        currentPage,
        loading,
        error,
        onPageChange,
        setRatingData,
    };
}