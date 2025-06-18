"use client";

import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { FaStar } from "react-icons/fa";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import OptimizedImage from "./OptimizedImage";
import Button from "./Button";
import { useReviewList } from "@/hooks/useReviewList";
import useHandleLike from "@/hooks/useHandleLike";
import Login from "@/auth/Login/Login";
import Register from "@/auth/Register/Register";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import OtpDialog from "@/auth/Login/OtpDialog";
import { useTranslations } from "next-intl";
import { Dialog, Transition } from "@headlessui/react";
// const TOTAL_REVIEWS = 10318;
const RATING = 5;
const MAX_STARS = 5;
const TOP_RATING_COUNT = 5;

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[999999] " onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0  bg-opacity-30 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-[999999] overflow-y-auto">
                    <div className="flex  items-center justify-center p-0 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-none sm:rounded-lg  bg-gray-900 text-left h-[100vh] transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                                <div className="sticky top-0 z-[9999999] bg-gray-900 px-6 pt-6 pb-4 border-b border-gray-700 flex justify-between items-start">
                                    <Dialog.Title className="sm:text-xl text-[14px] font-semibold text-white">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-white text-2xl font-bold ml-4"
                                        onClick={onClose}
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="p-6 pt-0 max-h-[75vh] overflow-y-auto text-white">
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};


const ReviewPredoctDetails = ({ productId, variantId }) => {
    const { ratingData, setRatingData } = useReviewList(productId, variantId);
    const [showLogin, setShowLogin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const {handleLike } = useHandleLike({ ratingData, setRatingData, openLoginPopup: () => { setShowLogin(true), setModalOpen(false) }, });
    const [topRatings, setTopRatings] = useState([]);
    const [openMobileOtp, setOpenMobileOtp] = useState(false);
    const [openForgotPassword, setOpenForgotPassword] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const handleOpenRegister = () => setOpenRegister(true);
    const handleCloseRegister = () => setOpenRegister(false);
    const handleOpenLogin = () => setShowLogin(true);
    const t = useTranslations();

    const handleCloseLogin = () => {
        setShowLogin(!showLogin);
    }

    const switchToRegister = () => {
        handleCloseLogin();
        handleOpenRegister();
    };
    const switchToLogin = () => {
        handleCloseRegister();
        handleOpenLogin();
    };

    useEffect(() => {
        if (ratingData && ratingData.length) {
            const filteredTop = ratingData.filter(
                (item) => Number(item.rating) === 5
            )
            if (filteredTop) {
                setTopRatings(filteredTop.slice(0, TOP_RATING_COUNT));
            } else {
                setTopRatings(filteredTop);
            }
        }
    }, [ratingData]);

    if (!ratingData.length > 0) {
        return null
    }

    const ReviewCard = ({ review, index }) => (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6 relative">
            <img
                src={
                    review.customer_photo ||
                    "https://d1tv1hwh9wfb3x.cloudfront.net/assets/images/user.png"
                }
                alt={review.customer_name || "Customer"}
                className="w-20 h-20 rounded-full object-cover self-center md:self-start"
            />

            <div className="flex-1">
                <div className="flex items-center justify-between ">
                    <h3 className="text-xl font-semibold mt-1">
                        {review?.customer_name || "Customer"}
                    </h3>
                    <span className="text-yellow-400 flex items-center gap-1">
                        {Array.from({ length: MAX_STARS }).map((_, idx) => (
                            <FaStar
                                key={idx}
                                className={
                                    idx < Number(review.rating)
                                        ? "w-5 h-5"
                                        : "w-5 h-5 text-gray-600"
                                }
                                aria-hidden="true"
                            />
                        ))}
                    </span>
                </div>

                <h4 className="italic mb-2 text-gray-300">{review?.headline}</h4>
                <p className="text-gray-200 whitespace-pre-line mb-4">{review?.review}</p>

                {review?.image && review?.image?.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                        {review.image.map((img) => (
                            <img
                                key={img.id}
                                src={img.link}
                                alt={`Review Image ${img.id}`}
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm mt-4 italic">{review?.created_at}</p>
                    <div className="flex items-center gap-2">
                        <div className=" cursor-pointer" onClick={() => handleLike(review?.id, index)}>
                            {review?.is_like ? (
                                <AiFillLike className=" text-red-700 w-6 h-6" />
                            ) : (
                                <AiOutlineLike className=" w-6 h-6" />
                            )}
                        </div>
                        <span className="mt-1">({review?.total_likes})</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="relative w-full min-h-screen overflow-auto  text-white px-4 py-28 ">
            <div className="absolute inset-0 -z-10">
                <OptimizedImage
                    src="https://cdn.pixabay.com/photo/2024/06/26/11/31/ai-generated-8854776_1280.jpg"
                    alt="Happy customer background"
                    fill
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="pt-28">
                <div className="max-w-xl mx-auto text-center mb-10">
                    <span className="text-5xl font-bold">{RATING.toFixed(1)}</span>
                    <div className="flex items-center justify-center gap-1 mt-2">
                        {Array.from({ length: MAX_STARS }).map((_, idx) => (
                            <FaStar
                                key={idx}
                                className="w-6 h-6 text-yellow-400"
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                </div>

                <div className="max-w-xl mx-auto mb-12 flex justify-center">
                    <Button
                        type="button"
                        label={t("read_review")}
                        variant="custom"
                        className="bg-white rounded-lg text-black px-6 py-2 text-base font-semibold transition-colors"
                        onClick={() => setModalOpen(true)}
                    />
                </div>

                <div className="max-w-3xl mx-auto space-y-8 ">
                    {topRatings.length > 0 ? (
                        topRatings?.slice(0, 1)?.map((review, index) => (
                            <ReviewCard key={review.id} review={review} index={index} />
                        ))
                    ) : (
                        <p className="text-center text-gray-400">No top reviews available.</p>
                    )}
                </div>

            </div>
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={t("all_customer_reviews")}
            >
                {ratingData && ratingData.length > 0 ? (
                    ratingData.map((review, index) => (
                        <div className="py-2">
                            <ReviewCard key={review?.id} review={review} index={index} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No reviews available.</p>
                )}
            </Modal>

            <Login
                open={showLogin}
                handleOpenRegister={handleOpenRegister}
                setOpenMobileOtp={handleOpenLogin}
                setOpenForgotPassword={setOpenForgotPassword}
                handleClose={handleCloseLogin}
                handleCloseRegister={handleCloseRegister}
                switchToRegister={switchToRegister}
            />

            <Register
                open={openRegister}
                switchToLogin={switchToLogin}
                handleClose={handleCloseRegister}
            />

            <ForgotPasswordModal
                open={openForgotPassword}
                handleClose={() => setOpenForgotPassword(false)}
                handleOpenLogin={handleOpenLogin}
                setOpenMobileOtp={setOpenMobileOtp}
                setUserData={setUserData}
            />
            <OtpDialog
                isDialogOpen={openMobileOtp}
                data={userData}
                handleCloseOtp={() => setOpenMobileOtp(false)}
            />
        </section>
    );
};

export default ReviewPredoctDetails;