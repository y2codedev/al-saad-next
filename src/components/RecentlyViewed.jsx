import { FavoriteBorder } from "@mui/icons-material";
import BoltIcon from "@mui/icons-material/Bolt";
import React from "react";
import Carousel from "react-multi-carousel";
import {
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Typography,
  Container,
  Card,
  Chip,
  CardMedia,
  CardContent,
  Rating,
} from "@mui/material";
import { Link } from "../i18n/navigation";
import CustomButtonGroup from "./CustomButtonGroup";
import useCartStore from "../store/useCartStore";
import { useWishListStore } from "../store/useWishListStore";
import useUserStore from "../store/user";
import Login from "../auth/Login/Login";
import Register from "../auth/Register/Register";
import ForgotPasswordModal from "../auth/Login/ForgotPasswordModal";
import useAbsolutePath from "../utils/useAbsolutePath";
import OtpDialog from "../auth/Login/OtpDialog";
import CartButton from "@/components/CartButton";

const RecentlyViewed = ({ productsCard, title }) => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const isRTL = useLanguageStore.getState().language === "ar";
  const [userData, setUserData] = useState(null);
  const {
    isItemInCart,
    toggleAddToCart,
    loadingVariants: loadingState,
  } = useCartStore();
  const { toggleWishlist, isItemInWishlist } = useWishListStore();
  const { isLoggedIn } = useUserStore();
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const handleForgotPassword = () => setOpenForgotPassword(true);
  const [userId, setUserId] = useState(null);
  const getPath = useAbsolutePath();

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  return (
    <div className="">
      <Container maxWidth="lg" sx={{ padding: 0 }}>
        <Box
          sx={{
            px: {
              xs: 2,
              sm: "0px",
            },
            my: 3,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              textAlign: "left",
              fontSize: {
                xs: "18px",
                sm: "24px",
              },
            }}
          >
            {title}
          </Typography>
          <Link
            state={{ type: "display_banners" }}
            href={getPath(
              `search?type=display-banner&id=${"recommended_product"}`,
            )}
            className="link-none"
          >
            <Typography
              variant="h6"
              sx={{
                color: "#bb1f2a",
                mt: 1,
                fontSize: "1rem",
                textAlign: "right",
              }}
            >
              <BoltIcon />
              View All
            </Typography>
          </Link>
        </Box>
        <hr />
        <Box sx={{ width: "100%", position: "relative", mt: 2 }}>
          <Carousel
            rtl={isRTL}
            additionalTransfrom={0}
            autoPlaySpeed={3000}
            renderButtonGroupOutside
            arrows={false}
            draggable
            infinite={true}
            responsive={{
              desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 4,
              },
              laptop: {
                breakpoint: { max: 1024, min: 768 },
                items: 4,
              },
              tablet: {
                breakpoint: { max: 768, min: 464 },
                items: 2,
              },
              mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 2,
              },
            }}
            showDots={false}
            slidesToSlide={3}
            swipeable
            customButtonGroup={
              !matchesSM ? <CustomButtonGroup top="48%" left="-45px" /> : null
            }
          >
            {productsCard &&
              productsCard.map((item) => (
                <Card
                  key={item.product_id}
                  sx={{
                    height: "100%",
                    overflow: "hidden",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                    cursor: "pointer",
                    boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
                    margin: {
                      xs: 1,
                      sm: "5px",
                    },
                  }}
                >
                  <Box position="relative">
                    {item.is_new === true && (
                      <Chip
                        label="New"
                        sx={{
                          position: "absolute",
                          height: "24px",
                          width: "50px",
                          top: 10,
                          right: 10,
                          backgroundColor: "#bb1f2a",
                          color: "#fff",
                          borderRadius: "0px",
                        }}
                      />
                    )}
                    <Link
                      state={{
                        product_id: item.product_id,
                        variant_id: item.product_variant_id,
                      }}
                      href={getPath(`products/${item.slug}`)}
                      className="link-none"
                    >
                      <CardMedia
                        sx={{
                          minHeight: { sm: "276.37px", xs: "175px" },
                          maxHeight: { sm: "276.37px", xs: "175px" },
                          objectFit: "cover",
                        }}
                        component="img"
                        image={item.image}
                        alt={item.title}
                        loading="lazy"
                      />
                    </Link>
                  </Box>
                  <CardContent sx={{ p: { xs: "8px", sm: "16px" } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        color: "292b2c",
                        fontWeight: 500,
                        lineHeight: "1.2",
                        alignSelf: "flex-start",
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        wordBreak: "break-all",
                        whiteSpace: "normal",
                        textOverflow: "ellipsis",
                        ":hover": {
                          color: "#bb1f2a",
                        },
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          displayDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {item.sale_price > 0 &&
                          item.sale_price !== item.list_price && (
                            <Typography
                              noWrap
                              sx={{
                                color: "#bb1f2a",
                                fontWeight: 600,
                                fontSize: { xs: "14px", sm: "1rem" },
                              }}
                            >
                              {item.sale_price} AED
                            </Typography>
                          )}

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            noWrap
                            sx={{
                              fontWeight:
                                item.sale_price > 0 &&
                                item.sale_price !== item.list_price
                                  ? "0"
                                  : "600",
                              color:
                                item.sale_price > 0 &&
                                item.sale_price !== item.list_price
                                  ? "gray"
                                  : "#bb1f2a",
                              textDecoration:
                                item.sale_price > 0 &&
                                item.sale_price !== item.list_price
                                  ? "line-through"
                                  : "none",
                              fontSize: { xs: "14px", sm: "1rem" },
                            }}
                          >
                            {item.list_price} AED
                          </Typography>
                          {item.sale_price > 0 &&
                            item.sale_price !== item.list_price && (
                              <Typography
                                noWrap
                                sx={{
                                  color: "green",
                                  fontSize: { xs: "14px", sm: "1rem" },
                                }}
                              >
                                {item.discount_label}
                              </Typography>
                            )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <CartButton
                          productVariantId={item?.product_variant_id}
                          isLoading={loadingState?.[item?.product_variant_id]}
                          isItemInCart={isItemInCart}
                          onClick={toggleAddToCart}
                        />
                        <IconButton
                          sx={{
                            p: { xs: "4px", sm: "8px" },
                            boxShadow: 2,
                            "& .css-1wdc28j-MuiSvgIcon-root": {
                              fill: isItemInWishlist(item?.product_variant_id)
                                ? "#fff"
                                : "#292b2c",
                              transition: "fill 0.3s ease",
                            },

                            backgroundColor: isItemInWishlist(
                              item?.product_variant_id,
                            )
                              ? "#bb1f2a"
                              : "#fff",
                            ":hover": {
                              backgroundColor: "#bb1f2a",
                              color: "#fff !important",
                              transition: "fill 0.3s ease",
                            },
                            color: "#292b2c",
                          }}
                          onClick={() => {
                            if (isLoggedIn === true) {
                              toggleWishlist(
                                item?.product_id?.toString(),
                                item?.product_variant_id?.toString(),
                              );
                            } else {
                              handleOpenLogin();
                            }
                          }}
                          aria-label="add to wishlist"
                        >
                          <FavoriteBorder sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Rating
                        disabled
                        sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
                        name="no-value"
                        value={0}
                      />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, color: "#9a9696" }}
                      >
                        (0)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Carousel>
        </Box>
      </Container>
      <Login
        open={openLogin}
        handleOpenRegister={handleOpenRegister}
        setOpenMobileOtp={handleOpenLogin}
        setOpenForgotPassword={setOpenForgotPassword}
        handleClose={handleCloseLogin}
        handleCloseRegister={handleCloseRegister}
        switchToRegister={switchToRegister}
        setUserData={setUserData}
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
    </div>
  );
};

export default RecentlyViewed;
