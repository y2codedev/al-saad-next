import useUserStore from "@/store/user";
import { showToast } from "@/utils/helper";
import ratingApi from "@/utils/services/ratingServices";
import { useCallback } from "react";

const useHandleLike = ({ ratingData, setRatingData, openLoginPopup }) => {
    const { userInfo } = useUserStore.getState();

    const handleLike = useCallback(async (reviewId, index) => {
        if (!userInfo) {
            return openLoginPopup();
        }

        try {
            const res = await ratingApi.likeRating({ rating_id: reviewId });
            if (res?.status === 200) {
                const updatedLikes = [...ratingData];
                updatedLikes[index].is_like = !updatedLikes[index].is_like;
                updatedLikes[index].total_likes = res.data.total_likes;
                setRatingData(updatedLikes);
            }
        } catch (error) {
            console.log(error);
            showToast?.("error", "Something went wrong while liking.");
        }
    }, [userInfo, ratingData, setRatingData]);

    return { handleLike };
};

export default useHandleLike;