"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import "react-multi-carousel/lib/styles.css";
import { FaRegCreditCard, FaUserLarge } from "react-icons/fa6";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useAddressStore } from "@/store/useAddressStore";
import { checkOutServices } from "@/utils/services/checkOutServices";
import { getPaymentUrlById, google_place_api, showToast } from "@/utils/helper";
import { useSettingsStore } from "@/store/useSettingsStore";
import { shippingApi } from "@/utils/services/shippingApi";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import _ from "lodash";
import ChekOutMap from "@/components/Map/ChekOutMap";
import placeOrderApi from "@/utils/services/placeOrder";
import { encryptData } from "@/utils/services/AlsaadRSA";
import useCartStore from "@/store/useCartStore";
import Script from 'next/script';
import {
  Done,
  Close,
  CheckBoxSharp,
  CheckBoxOutlineBlankSharp,
} from "@mui/icons-material";
import useUserStore from "@/store/user";
import Login from "@/auth/Login/Login";
import Register from "@/auth/Register/Register";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import COLORS from "@/utils/colors";
import ImagePath from "@/constants/imagepath";
import styles from "@/components/Map/styles";
import { userService } from "@/utils/services/userServices";
import OtpDialog from "@/auth/Login/OtpDialog";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import ShippingAddressDialog from "@/components/ShippingAddressDialog";
import { useMediaQuery, useTheme } from "@mui/material";
import { useLanguageStore } from "@/store/useLanguageStore";
import { giftApi } from "@/utils/services/giftServices";
import PaymentMethodItemCard from "@/components/PaymentMethodItemCard";
import ShippingMethodItemCard from "@/components/ShippingMethodItemCard";
import {
  container,
  title,
  paymentMethodBox,
  checkboxStyle,
  termsText,
} from "@/styles/checkoutStyled";
import CheckoutProductList from "@/components/CheckoutProductList";
import GiftDialog from "@/components/gift/GiftPackagingModal";
import FullScreenImageModal from "@/components/home/FullScreenImageModal";
import API from "@/utils/services/Endpoints";
import { useParams } from "next/navigation";
import TabbyTamaraWidget from "@/components/ProductPage";

const Checkout = () => {
  const selectRef = useRef(null);
  const theme = useTheme();
  const params = useParams();
  const matchesSM = useMediaQuery(theme.breakpoints.down("md"));
  const isRTL = useLanguageStore.getState().language === "en";
  const [currentLocation, setCurrentLocation] = useState({
    lat: 23.8859,
    lng: 45.0792,
  });
  const router = useRouter();
  const [opneShhipingAddress, setOpenShhipingAddress] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  const { addresses, getShipping } = useAddressStore();
  const [dailog, setDailog] = useState(false);
  const [placingLoading, showPlacingLoading] = useState(false);
  const handleOpenDailog = () => setDailog(true);
  const handleCloseDailog = () => setDailog(false);
  const { selectedCountry } = useSettingsStore();
  const [city, setCity] = useState([]);
  const [area, setArea] = useState([]);
  const [userData, setUserData] = useState(null);
  const [checkout, setCheckOut] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cuoponCode, setCuoponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { userInfo, setUserInfo } = useUserStore();
  const { cartItems } = useCartStore();
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState("standard");
  const [selectedOption, setSelectedOption] = useState(1);
  const [gift, setGift] = useState([]);
  const [giftData, setGiftData] = useState(
    "https://staging.alsaadhome.com/card/images/gift_card_1746093449.png",
  );
  const [isGiftSaved, setIsGiftSaved] = useState(false);
  const [priviewImage, setPriviewImage] = useState(false);
  const formikRef = useRef(null);
  const titleRef = useRef(null);
  const t = useTranslations();
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);

  const [initialValues, setInitialValues] = useState({
    country_id: selectedCountry?.id,
    city_id: selectedAddress?.city_id,
    area_id: selectedAddress?.area_id,
    address: selectedAddress?.address,
    latitude: "",
    longitude: "",
    note: selectedAddress?.note,
    name: selectedAddress?.name,
    mobile_number: selectedAddress?.mobile_number,
    alternate_number: selectedAddress?.alternate_number,
    email: selectedAddress?.email,
    is_default: selectedAddress?.is_default,
    country_code: selectedAddress?.code || "",
    receiver_name: selectedAddress?.receiver_name,
    sender_name: selectedAddress?.sender_name,
    message: selectedAddress?.message,
    gift_id: "",
  });

  useEffect(() => {
    setInitialValues({
      ...initialValues,
      country_id: selectedCountry?.id || "",
      country_code: selectedCountry?.code || "",
    });
  }, [selectedCountry]);

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };
  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  const handleCloseShhipingAddress = () => {
    setOpenShhipingAddress(false);
  };

  const handleOpenShhipingAddress = () => {
    setOpenShhipingAddress(true);
  };

  const navigateToTermsCondactions = () => {
    router.push("/terms-of-use");
  };

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    const fetchAddress = async () => {
      try {
        await getShipping();
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddress();
  }, [userInfo]);

  const addCuoponCode = async (id, cuoponCode) => {
    if (!cuoponCode && !id) {
      return;
    }

    setLoading(true);
    try {
      const req = {
        code: cuoponCode,
        checkout_id: id,
      };
      const response = await checkOutServices.addCoupon(req);
      if (response && response.status === 200) {
        showToast("success", response.message);
        setAppliedCoupon(cuoponCode);
        setCuoponCode(cuoponCode);
        fetchCheckOut(
          formikRef.current.values,
          cuoponCode,
          selectedShippingMethod,
          selectedPaymentMethod,
          false,
          cuoponCode,
        );
      } else {
        setAppliedCoupon(null);
        setCuoponCode("");
        showToast("error", response.message);
      }
    } catch (error) {
      setAppliedCoupon(null);
      setCuoponCode("");
      showToast("error", error.message);
      console.error("Error in addCuoponCode:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    if (!checkout?.checkout_id) {
      return showToast("error", "Please select address first");
    }
    if (cuoponCode.trim()) {
      addCuoponCode(checkout?.checkout_id, cuoponCode);
    }
  };

  const handleRemoveCoupon = () => {
    setCuoponCode("");
    setAppliedCoupon(null);
    fetchCheckOut(
      formikRef.current.values,
      undefined,
      selectedShippingMethod,
      selectedPaymentMethod,
      false,
      "",
    );
  };

  const locationSelected = (searchResult) => {
    if (!searchResult) return;

    const place = searchResult.getPlace();
    if (!place?.geometry?.location) return;

    const { lat, lng } = place.geometry.location;
    setCurrentLocation({ lat: lat(), lng: lng() });

    const addressComponents = place.address_components || [];
    const formattedAddress = place.formatted_address || "";

    const cityComponent = addressComponents.find(
      ({ types }) =>
        types.includes("locality") ||
        types.includes("administrative_area_level_1"),
    );
    const newCity = cityComponent?.long_name || "";

    const isValidCity = city?.find(
      ({ city_name }) => city_name?.toLowerCase() === newCity?.toLowerCase(),
    );

    if (formikRef.current) {
      formikRef.current.setFieldValue("address", formattedAddress);
      formikRef.current.setFieldValue("area_id", "");
      if (isValidCity) {
        formikRef.current.setFieldValue("city_id", isValidCity.id);
        getArea(isValidCity.id);
      } else {
        formikRef.current.setFieldValue("city_id", "");
      }
    }
  };

  const handleDragEnd = (e) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      fetchAddress(lat, lng);
      setCurrentLocation({ lat, lng });
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${google_place_api}`,
      );

      const results = data?.results || [];
      if (!results.length) return;

      const formattedAddress = results[0]?.formatted_address || "";
      const addressComponents = results[0]?.address_components || [];

      const cityComponent = addressComponents.find(
        ({ types }) =>
          types.includes("locality") ||
          types.includes("administrative_area_level_1"),
      );
      const newCity = cityComponent?.long_name || "";
      const isValidCity = city?.find(
        ({ city_name }) => city_name?.toLowerCase() === newCity?.toLowerCase(),
      );

      if (formikRef.current) {
        formikRef.current.setFieldValue("address", formattedAddress);
        formikRef.current.setFieldValue("area_id", "");
        if (isValidCity) {
          formikRef.current.setFieldValue("city_id", isValidCity.id);
          getArea(isValidCity.id);
        } else {
          formikRef.current.setFieldValue("city_id", "");
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    mobile_number: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d+$/, "Only numbers are allowed")
      .min(
        selectedCountry?.mobile_digits,
        `Must be at least ${selectedCountry?.mobile_digits} digits`,
      ),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    address: Yup.string().required("address is required"),
    city_id: Yup.string().required("City is required"),
    area_id: Yup.string().required("Area is required"),
    country_id: Yup.string().required("Country is required"),
    gift_id: Yup.string().when([], {
      is: () => isGiftDialogOpen || !!checkout?.gift_id,
      then: (schema) => schema.required("Gift item is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    message: Yup.string().when([], {
      is: () => isGiftDialogOpen || !!checkout?.gift_id,
      then: (schema) => schema.required("Gift message is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const getCity = async () => {
    if (!selectedCountry?.id) {
      return;
    }
    try {
      let req = { country_id: selectedCountry?.id };
      const response = await shippingApi.getCity(req);
      if (response && response.status === 200) {
        setCity(response.data);
      } else {
        console.log("Error fetching city data:-", response);
      }
    } catch (error) {
      console.log("Error fetching city data:-", error);
    }
  };

  const getArea = async (cityId) => {
    try {
      setAreaLoading(true);
      let req = {
        country_id: selectedCountry?.id,
        city_id: cityId ?? initialValues.city_id,
      };
      const response = await shippingApi.getArea(req);
      if (response && response.status === 200) {
        setArea(response.data);
      } else {
        console.log("Error fetching area data:-", response);
      }
    } catch (error) {
      console.log("Error fetching area data:-", error);
    } finally {
      setAreaLoading(false);
    }
  };

  function getDefaultAddress() {
    if (addresses && addresses?.length > 0) {
      const isDefault = addresses?.find((item) => item?.is_default === 0);
      if (isDefault) {
        setSelectedAddress(isDefault);
        fetchCheckOut(isDefault, cuoponCode);
        setInitialValues({
          ...initialValues,
          address: isDefault?.address,
          city: isDefault?.city,
          area: isDefault?.area,
          name: isDefault?.name,
          mobile_number: isDefault?.mobile_number,
          alternate_number: isDefault?.alternate_number,
          email: isDefault?.email,
          country_code: isDefault?.country_code,
          country_id: isDefault?.country_id,
          city_id: isDefault?.city_id,
          area_id: isDefault?.area_id,
        });
      } else {
        const firstAddress = addresses[0];
        setSelectedAddress(firstAddress);
        fetchCheckOut(firstAddress, cuoponCode);
        setInitialValues({
          ...initialValues,
          address: firstAddress.address,
          city: firstAddress.city,
          area: firstAddress.area,
          name: firstAddress.name,
          mobile_number: firstAddress.mobile_number,
          alternate_number: firstAddress.alternate_number,
          email: firstAddress.email,
          country_code: firstAddress.country_code,
          country_id: firstAddress.country_id,
          city_id: firstAddress.city_id,
          area_id: firstAddress.area_id,
        });
      }
    }
  }

  const debouncedGetArea = useCallback(_.debounce(getArea, 300), [
    initialValues?.city_id,
  ]);

  const fetchCheckOut = async (
    selectedAddress,
    coupon,
    selectedShippingMethod = "standard",
    payment_method,
    showPriview,
    applied_coupon,
  ) => {
    let appliedCouponCode = applied_coupon ?? appliedCoupon;
    let cart_id = localStorage.getItem("cart_id");
    let checkoutData = {
      address_confirmation: selectedOption,
      address: selectedAddress?.address,
      device_type: "web",
      whatsapp_number: selectedAddress?.alternate_number,
      city_id: selectedAddress?.city_id ?? "",
      area_id: selectedAddress?.area_id ?? "",
      country_code: selectedAddress?.country_code,
      token: "",
      is_coupon_applied: appliedCouponCode ? true : false,
      email: selectedAddress?.email ?? selectedAddress?.email,
      customer_id: userInfo?.id,
      ...(appliedCouponCode && {
        applied_coupon: coupon ?? "",
      }),
      cart_id: cart_id,
      version: "36",
      userName: selectedAddress?.name ?? selectedAddress?.name,
      currency: selectedCountry?.currency_code,
      country_id: selectedAddress?.country_id,
      mobile_number: selectedAddress?.mobile_number,
      is_wallet: "0",
      area_name: selectedAddress?.area_name,
      appartment: selectedAddress?.appartment,
      building: selectedAddress?.building,
      order_shipping_type: selectedShippingMethod,
      note: selectedAddress?.note,
      payment_method: payment_method ?? selectedPaymentMethod,
      ...(((selectedAddress?.gift_id && showPriview) ||
        (selectedAddress?.gift_id && checkout?.gift_id)) && {
        gift_id: selectedAddress?.gift_id || "",
        gift_receiver_name: selectedAddress?.name,
        gift_sender_name: selectedAddress?.sender_name,
        gift_message: selectedAddress?.message,
      }),
    };

    try {
      const response = await checkOutServices.checkOut(checkoutData);
      if (response && response.status === 200) {
        setCheckOut(response?.data);
        if (response?.data?.gift_id && showPriview) {
          fetchGiftData(
            selectedAddress?.receiver_name,
            selectedAddress?.sender_name,
            selectedAddress?.message,
          );
        }
      } else {
        showToast("error", response?.message);
      }
    } catch (error) {
      showToast("error", error?.message);
      console.log(error);
    }
  };

  const addPlaceOrder = async () => {
    if (!checkout?.checkout_id) {
      showToast("error", "checkout_id is undefined");
      return;
    }
    if (!selectedPaymentMethod) {
      return showToast("error", "Please Select Payment Method");
    }

    if (!checkedTerms) {
      return showToast("error", "Please accept terms and conditions");
    }
    showPlacingLoading(true);

    const encryptedCheckoutId = encryptData(checkout?.checkout_id?.toString());
    try {
      const req = {
        order_delivery_type_id: selectedShippingMethod,
        checkout_id: encryptedCheckoutId,
        payment_method: 1,
        customer_id: userInfo?.id,
      };
      const response = await placeOrderApi.placeOreder(req);
      if (response && response.status === 200) {
        showToast("success", response.message, "success");
        setCheckOut(null);
        if (!userInfo && response?.data?.user) {
          await setUserInfo(response?.data?.user);
        }
        router.push(`/checkout-success?order_id=${response?.data?.order_id}`);
      }
    } catch (error) {
      console.log(error, "error in place order");
    } finally {
      showPlacingLoading(false);
    }
  };

  const handlePaymentMethodChange = async (value) => {
    setSelectedPaymentMethod(value);
    fetchCheckOut(
      formikRef.current.values,
      cuoponCode,
      selectedShippingMethod,
      value,
    );
  };

  const handleShippingMethodChange = (value) => {
    if (value === selectedShippingMethod) {
      return;
    }
    setSelectedShippingMethod(value);
    if (selectedAddress) {
      fetchCheckOut(selectedAddress, cuoponCode, value);
    }
  };

  const handleEncryptPassword = async (password) => {
    try {
      const res = await fetch("/api/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error("Encryption failed");
      }

      const data = await res.json();
      return data.encrypted;
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  };

  const checkUser = async (phone, code, type = "phone") => {
    try {
      const req = {
        phone,
        type,
        country_code: code,
        customer_id: userInfo?.id ?? "",
      };
      const res = await userService.checkUser(req);
      if (res.status !== 200) {
        showToast("error", res?.message);
        return false;
      }
      if (res?.status === 200 && !res?.data?.is_registerd) {
        return true;
      }

      const encryptedPhone = await handleEncryptPassword(
        phone?.toString() || "",
      );
      const encryptedCountryCode = encryptData(
        code?.toString() || selectedCountry?.code?.toString(),
      );
      const encryptedData = {
        user_id: userInfo?.id,
        country_code: encryptedCountryCode,
        phone: encryptedPhone,
        type: "phone",
      };

      const response = await userService.sendOtp(encryptedData);
      if (response?.status === 200) {
        setUserData({
          user_id: userInfo?.id || response?.data?.user_id,
          country_code: code?.toString(),
          phone: phone,
          type: "phone",
        });
        showToast("success", response?.message);
        setOpenMobileOtp(true);
        return false;
      } else {
        showToast("error", response?.message);
        return false;
      }
    } catch (error) {
      console.log("Error in checkUser:", error);
    }
  };

  async function payOrder() {
    if (!selectedPaymentMethod)
      return showToast("error", "Please Select Payment Method");
    if (!checkedTerms)
      return showToast("error", "Please accept terms and conditions");
    let usProcidable = userInfo
      ? true
      : await checkUser(
        formikRef.current.values?.mobile_number,
        formikRef.current.values?.country_code,
      );

    console.log(usProcidable, "usProcidable");
    if (!usProcidable) {
      return;
    }

    if (selectedPaymentMethod === 1) return addPlaceOrder();
    showPlacingLoading(true);

    try {
      const id = await encryptData(checkout?.checkout_id?.toString());

      const res = await shippingApi.placeOrderTemp({
        token: "",
        payment_method: selectedPaymentMethod,
        checkout_id: id,
        order_delivery_type_id: selectedShippingMethod,
      });

      if (res?.status !== 200) {
        return;
      }

      const { gateway_order_id, gateway_transaction_id } = res.data || {};
      let methodUrl = await getPaymentUrlById(selectedPaymentMethod);
      if (!methodUrl) {
        return showToast("error", "Payment method not found");
      }

      let redirect_url =
        selectedPaymentMethod === 9
          ? `/${params.locale}/${params.currency}/checkout-success?gateway_order_id=${gateway_order_id}&gateway_transaction_id=${gateway_transaction_id}`
          : `/${params.locale}/${params.currency}/checkout-success`;

      const response = await shippingApi.payByCard(methodUrl, {
        gateway_order_id,
        gateway_transaction_id,
        redirect_url: window.location.origin + redirect_url,
        cancel_url:
          window.location.origin +
          `/${params.locale}/${params.currency}/checkout`,
        failure_url:
          window.location.origin +
          `/${params.locale}/${params.currency}/checkout`,
      });

      if (response?.status !== 200 || !response.data?.redirect_url) {
        throw new Error("Payment processing failed");
      }

      window.location.href = response.data.redirect_url;
    } catch (error) {
      console.error("Payment Error:", error);
    } finally {
      showPlacingLoading(false);
    }
  }

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });

            fetchAddress(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.log("Error getting current location:", error);
          },
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    } else {
      alert("Geolocation is not supported in your browser.");
    }
  }, []);

  useEffect(() => {
    debouncedGetArea();
  }, [initialValues?.city_id]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    getDefaultAddress();
  }, [addresses]);

  useEffect(() => {
    getCity();
  }, [selectedCountry]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const getGiftLists = async () => {
    try {
      const response = await giftApi.getGiftList();
      if (response && response.status === 200) {
        setGift(response?.data);
      }
    } catch (error) {
      console.log(error, "error in get gift list");
    }
  };

  useEffect(() => {
    getGiftLists();
  }, []);

  const fetchGiftData = async (receiver_name, sender_name, message) => {
    try {
      setPriviewImage(true);
      return;
      const res = await giftApi.getGiftMaker(
        receiver_name,
        sender_name,
        message,
      );
      if (res && res.status === 200) {
        // setGiftData(res);
        setPriviewImage(true);
      } else {
        console.error("Failed to fetch gift data:", res);
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  function callCheckout(values, showPriview) {
    let { address, city_id, area_id, email, name, country_id, mobile_number } =
      values;
    if (
      address &&
      city_id &&
      area_id &&
      email &&
      name &&
      country_id &&
      mobile_number
    ) {
      fetchCheckOut(
        values,
        cuoponCode,
        selectedShippingMethod,
        selectedPaymentMethod,
        showPriview,
      );
    }
  }

  const isCheckout = !!checkout;
  const data = isCheckout
    ? checkout
    : cartItems?.branch?.length > 0
      ? cartItems.branch.find((item) => item.branch_id == 1)
      : null;
  const currency = isCheckout
    ? checkout?.currency
    : selectedCountry?.currency_code;

  const discountData = isCheckout
    ? {
      sub_total: checkout?.sub_total,
      convert_shipping_cost: checkout?.convert_shipping_cost,
      convert_processing_fees: checkout?.convert_processing_fees,
      discount_amount: checkout?.discount_amount,
      discount_percentage: checkout?.discount_percentage,
      final_order_total_price: checkout?.final_order_total_price,
      gift_amount: checkout?.gift_amount,
    }
    : {
      total_amount: cartItems?.total_amount,
    };
  console.log(checkout?.final_order_total_price, discountData?.total_amount, 'discountData')

  return (
    <Box sx={{ my: 4, py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ width: "100%" }}>
          {!userInfo && (
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Box sx={styles.box}>
                <FaUserLarge color={COLORS.primary} />
                <Typography color="#687188" sx={styles.text} variant="h6">
                  {t("checkout")}
                </Typography>
                <Typography
                  onClick={handleOpenLogin}
                  sx={styles.loginText}
                  variant="h6"
                >
                  {t("click_here_to_login")}
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Box sx={styles.box}>
              <LocalOfferIcon sx={{ color: COLORS.primary }} />
              <Typography
                color="#687188"
                sx={styles.text}
                className="text-base"
              >
                {t("do_you_have_coupon")}
              </Typography>
            </Box>
            <Box sx={styles.containerBox}>
              <Grid container alignItems="stretch" sx={styles.gridContainer}>
                <Grid
                  size={{
                    xs: 6,
                    sm: 8,
                  }}
                >
                  <TextField
                    value={cuoponCode}
                    onChange={(e) => setCuoponCode(e.target.value)}
                    fullWidth
                    name="coupon"
                    placeholder="Enter Coupon"
                    variant="outlined"
                    sx={styles.textFieldCoupon}
                    InputProps={{
                      endAdornment: appliedCoupon ? (
                        <InputAdornment position="end">
                          <IconButton onClick={handleRemoveCoupon} size="small">
                            <Close color="error" />
                          </IconButton>
                          <Done color="success" />
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 6,
                    sm: 4,
                  }}
                >
                  <Button
                    onClick={handleApplyCoupon}
                    fullWidth
                    disabled={!cuoponCode?.trim() || appliedCoupon}
                    variant="contained"
                    sx={styles.button(appliedCoupon)}
                  >
                    {loading ? (
                      <Box sx={styles.loaderBox}>
                        <CircularProgress color="inherit" size={24} />{" "}
                        {t("apply")}...
                      </Box>
                    ) : appliedCoupon ? (
                      t("applied")
                    ) : (
                      t("apply_coupon")
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {/* <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                    
                    </Grid> */}
          <Grid size={12}>
            <Box sx={styles.wrapper}>
              <Box sx={styles.line} />
              <FaRegCreditCard size={30} style={styles.icon} />
              <Box sx={styles.line} />
            </Box>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            <Typography
              ref={titleRef}
              sx={styles.sectionTitle}
              variant="h6"
              gutterBottom
              className="center_sc"
            >
              {t("billing_details")}
            </Typography>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={validationSchema}
              validateOnChange
              enableReinitialize
              onSubmit={(values) => {
                fetchCheckOut(values);
              }}
            >
              {({
                handleChange,
                handleSubmit,
                errors,
                values,
                touched,
                setFieldValue,
                setValues,
                isValid,
                validateForm,
              }) => {
                console.log("values", values);
                return (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      name="name"
                      value={values?.name}
                      onChange={handleChange}
                      fullWidth
                      onBlur={(event) => {
                        if (!isValid) {
                          return;
                        }
                        let newValue = {
                          ...values,
                          name: event.target.value,
                        };
                        callCheckout(newValue);
                      }}
                      placeholder={t("enter_your_name")}
                      variant="outlined"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      sx={styles.textField}
                    />
                    <Grid container spacing={2}>
                      <Grid
                        size={{
                          xs: 5,
                          sm: 3,
                        }}
                      >
                        <FormControl fullWidth>
                          <Select
                            MenuProps={{ disableScrollLock: true }}
                            value={selectedCountry?.code || ""}
                            variant="outlined"
                            disabled
                            sx={styles.countrySelect}
                          >
                            <MenuItem
                              disabled
                              sx={{ display: "flex", alignItems: "center" }}
                              value={selectedCountry?.code || ""}
                            >
                              {/* <Image
                                                                src={selectedCountry?.flag}
                                                                alt={selectedCountry?.name}
                                                                width={23}
                                                                height={23}
                                                                className="mr-1"
                                                                loading="lazy"
                                                            /> */}
                              <div>{selectedCountry?.code}</div>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Mobile Number Input */}
                      <Grid
                        size={{
                          xs: 7,
                          sm: 9,
                        }}
                      >
                        <TextField
                          focused={!!values?.mobile_number}
                          name="mobile_number"
                          value={values?.mobile_number}
                          onChange={handleChange}
                          fullWidth
                          type="number"
                          onBlur={(event) => {
                            if (!isValid) {
                              return;
                            }
                            let newValue = {
                              ...values,
                              mobile_number: event.target.value,
                            };
                            callCheckout(newValue);
                          }}
                          placeholder={t("enter_your_mobile")}
                          error={
                            touched?.mobile_number &&
                            Boolean(errors?.mobile_number)
                          }
                          helperText={
                            touched?.mobile_number && errors?.mobile_number
                          }
                          required
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      {/* Select Country Code */}
                      <Grid
                        size={{
                          xs: 5,
                          sm: 3,
                        }}
                      >
                        <FormControl fullWidth>
                          <Select
                            disabled
                            MenuProps={{ disableScrollLock: true }}
                            value={selectedCountry?.code || ""}
                            variant="outlined"
                            sx={styles.countrySelect}
                          >
                            <MenuItem value={selectedCountry?.code}>
                              {/* <img
                                                                src={selectedCountry?.flag}
                                                                alt={selectedCountry?.name}
                                                                style={{
                                                                    width: "23px",
                                                                    height: "23px",
                                                                    marginRight: "4px",
                                                                }}
                                                            /> */}
                              {selectedCountry?.code}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Mobile Number Input */}
                      <Grid
                        size={{
                          xs: 7,
                          sm: 9,
                        }}
                      >
                        <TextField
                          focused={!!values?.alternate_number}
                          name="alternate_number"
                          value={values?.alternate_number}
                          onChange={handleChange}
                          fullWidth
                          type="number"
                          placeholder={t("enter_your_whatsapp")}
                          error={
                            touched?.alternate_number &&
                            Boolean(errors?.alternate_number)
                          }
                          helperText={
                            touched?.alternate_number &&
                            errors?.alternate_number
                          }
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      name="email"
                      focused={!!values?.email}
                      value={values?.email}
                      onChange={handleChange}
                      onBlur={(event) => {
                        if (!isValid) {
                          return;
                        }
                        let newValue = {
                          ...values,
                          email: event.target.value,
                        };
                        callCheckout(newValue);
                      }}
                      fullWidth
                      placeholder={t("please_enter_email")}
                      variant="outlined"
                      error={touched?.email && Boolean(errors?.email)}
                      helperText={touched?.email && errors?.email}
                      sx={{ my: 2 }}
                    />
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="gift"
                        name="gift"
                        dis
                        className="peer hidden"
                        checked={isGiftDialogOpen || !!checkout?.gift_id}
                        onChange={(e) => {
                          if (checkout?.gift_id) {
                            setFieldValue("gift_id", "");
                            setFieldValue("receiver_name", "");
                            setFieldValue("sender_name", "");
                            setFieldValue("message", "");
                            if (!isValid) return;

                            callCheckout({
                              ...values,
                              gift_id: "",
                              receiver_name: "",
                              sender_name: "",
                              message: "",
                            });
                          } else {
                            setIsGiftDialogOpen(e.target.checked);
                          }
                        }}
                      />
                      <label
                        htmlFor="gift"
                        className="w-6 h-6 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer
                                                 peer-checked:bg-red-500 peer-checked:text-white text-white peer-checked:border-red-500 transition-all duration-150"
                      >
                        ✓
                      </label>
                      <div className="flex  gap-2 items-center">
                        <p>Send as a Gift 🎁</p>
                        {checkout?.gift_id && (
                          <div className="">
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  {
                                    e.preventDefault();
                                    fetchGiftData(
                                      values?.receiver_name,
                                      values?.sender_name,
                                      values?.message,
                                    );
                                  }
                                }}
                                className="bg-gray-200 px-3 py-1 rounded text-xs cursor-pointer"
                              >
                                Preview
                              </button>
                              <button
                                className="bg-[#bb1f2a] text-white px-3 py-1 rounded text-xs cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setIsGiftDialogOpen(true);
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <GiftDialog
                      isOpen={isGiftDialogOpen}
                      setIsOpen={setIsGiftDialogOpen}
                      gift={gift}
                      isRTL={isRTL}
                      matchesSM={matchesSM}
                      selectedOption={selectedOption}
                      handleOptionChange={handleOptionChange}
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      getCity={getArea}
                      handleClickOpen={() => {
                        callCheckout(values, true);
                        console.log("handleClickOpen");
                      }}
                      cities={city || []}
                      areas={area || []}
                      setIsGiftSaved={setIsGiftSaved}
                      imageLink={
                        "https://media.alsaadhome.com/uploads/gift/gift-3-31742386635.jpg"
                      }
                      validateForm={validateForm}
                      setFieldValue={setFieldValue}
                      handlePriview={() => {
                        fetchGiftData(
                          values?.receiver_name,
                          values?.sender_name,
                          values?.message,
                        );
                      }}
                      currentLocation={currentLocation}
                      handleDragEnd={handleDragEnd}
                      selectedCountry={selectedCountry}
                      handleCloseDailog={handleCloseDailog}
                      locationSelected={locationSelected}
                    />

                    {userInfo && (
                      <Button
                        fullWidth
                        onClick={handleOpenShhipingAddress}
                        variant="contained"
                        sx={{
                          marginBottom: 2,
                          backgroundColor: COLORS.primary,
                        }}
                      >
                        {t("shipping_address")}
                      </Button>
                    )}
                    {/* <div>send as gift</div> */}
                    <FormControl fullWidth>
                      <Select
                        MenuProps={{ disableScrollLock: true }}
                        fullWidth
                        disabled
                        variant="outlined"
                        value={selectedCountry?.country_name || ""}
                        defaultValue={selectedCountry?.country_code}
                        sx={styles.textField}
                      >
                        <MenuItem
                          value={selectedCountry?.country_name}
                          sx={styles.menuItem}
                        >
                          {selectedCountry?.country_name}
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <Select
                        MenuProps={{ disableScrollLock: true }}
                        fullWidth
                        variant="outlined"
                        value={values.city_id?.toString() || "Select City"}
                        error={touched?.city_id && Boolean(errors?.city_id)}
                        onChange={(e) => {
                          setFieldValue("city_id", e.target.value);
                          setFieldValue("area_id", "");
                          getArea(e.target.value);
                        }}
                        sx={
                          touched?.city_id && errors?.city_id
                            ? {}
                            : styles.textField
                        }
                      >
                        <MenuItem
                          disabled
                          sx={{ display: "none" }}
                          value="Select City"
                        >
                          {t("select_city")}
                        </MenuItem>
                        {city?.map((item) => (
                          <MenuItem
                            key={item?.id}
                            value={item?.id}
                            sx={styles.menuItem}
                          >
                            {item?.city_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched?.city_id && errors?.city_id && (
                        <FormHelperText sx={styles.textField} error>
                          {errors?.city_id}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl fullWidth>
                      <Select
                        endAdornment={
                          <InputAdornment position="end">
                            {areaLoading && (
                              <CircularProgress
                                size={20}
                                sx={{ mx: 3, color: COLORS.primary }}
                              />
                            )}
                          </InputAdornment>
                        }
                        ref={selectRef}
                        displayEmpty={true}
                        MenuProps={{ disableScrollLock: true }}
                        fullWidth
                        variant="outlined"
                        value={values.area_id || "Select Area"}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue("area_id", newValue);
                        }}
                        onClose={() => {
                          setTimeout(() => {
                            document?.activeElement?.blur();
                          }, 0);
                        }}
                        onBlur={(e) => {
                          const newValue = e.target.value;
                          if (!isValid) {
                            return;
                          }
                          let updatedValues = {
                            ...values,
                            area_id: newValue,
                          };
                          callCheckout(updatedValues);
                        }}
                        disabled={!values.city_id}
                        error={touched?.area_id && Boolean(errors?.area_id)}
                        sx={
                          touched?.area_id && errors?.area_id
                            ? {}
                            : styles?.textField
                        }
                      >
                        <MenuItem
                          value="Select Area"
                          disabled
                          sx={{ display: "none" }}
                        >
                          {t("select_area")}
                        </MenuItem>
                        {area?.map((item) => (
                          <MenuItem
                            key={item?.id}
                            value={item?.id}
                            sx={styles?.menuItem}
                          >
                            {item?.area_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched?.area_id && errors?.area_id && (
                        <FormHelperText sx={styles?.textField} error>
                          {errors?.area_id}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <TextField
                      focused={!!values?.note}
                      name="note"
                      value={values?.note}
                      onChange={handleChange}
                      fullWidth
                      placeholder={t("note")}
                      variant="outlined"
                      sx={styles.textField}
                      error={touched.note && Boolean(errors.note)}
                      helperText={touched.note && errors.note}
                    />
                    <Box>
                      <TextField
                        fullWidth
                        focused={!!values?.address}
                        placeholder={t("add_address")}
                        variant="outlined"
                        name="address"
                        onChange={handleChange}
                        onBlur={(event) => {
                          if (!isValid) {
                            return;
                          }
                          let newValue = {
                            ...values,
                            address: event.target.value,
                          };
                          callCheckout(newValue);
                        }}
                        value={values?.address}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        sx={styles.textField}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              onClick={handleOpenDailog}
                              sx={{ cursor: "pointer" }}
                              position="end"
                            >
                              <LocationOnIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    {userInfo && (
                      <ShippingAddressDialog
                        open={opneShhipingAddress}
                        onClose={handleCloseShhipingAddress}
                        addresses={addresses}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                        setValues={setValues}
                        fetchCheckOut={fetchCheckOut}
                        getArea={getArea}
                        couponCode={cuoponCode}
                      />
                    )}
                    <ChekOutMap
                      dailog={dailog}
                      handleCloseDailog={handleCloseDailog}
                      onPlaceChanged={locationSelected}
                      address={values.address}
                      setAddress={setFieldValue}
                      onBlur={(event) => {
                        if (!isValid) {
                          return;
                        }
                        let newValue = {
                          ...values,
                          address: event.target.value,
                        };
                        callCheckout(newValue);
                      }}
                      currentLocation={currentLocation}
                      handleDragEnd={handleDragEnd}
                      selectedCountry={selectedCountry}
                    />
                    <FullScreenImageModal
                      imageUrl={giftData}
                      isVisible={priviewImage}
                      onClose={() => {
                        setPriviewImage(false);
                      }}
                    />
                  </form>
                );
              }}
            </Formik>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 7,
            }}
          >
            <Typography
              sx={{
                color: "#292b2c",
                fontSize: { xs: "18px", md: "22px" },
                fontWeight: "700",
                mb: 4,
              }}
              variant="h6"
            >
              {t("your_oders")}
            </Typography>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                padding: 2,
                backgroundColor: "#f7f8fb",
              }}
            >
              {data && (
                <CheckoutProductList
                  items={data?.item || []}
                  currency={currency}
                  isCheckout={isCheckout}
                  discountData={discountData}
                  t={t}
                />
              )}

              {checkout && (
                <div style={{ background: "#fff", borderRadius: "12px" }}>
                  <ShippingMethodItemCard
                    item={{
                      id: "standard",
                      description: checkout?.standard_message,
                      title: checkout?.standard_title || t("standard_delivery"),
                      price: checkout?.standard_delivery_price || "0",
                      imageUrl: ImagePath.standard,
                    }}
                    selectedShippingMethod={selectedShippingMethod}
                    handleShippingMethodChange={handleShippingMethodChange}
                  />

                  {checkout?.is_premium && (
                    <ShippingMethodItemCard
                      item={{
                        id: "premium",
                        description: checkout?.premium_delivery_message,
                        title: "Premium Delivery",
                        price: checkout?.premium_delivery_price,
                        imageUrl: ImagePath.premium,
                      }}
                      selectedShippingMethod={selectedShippingMethod}
                      handleShippingMethodChange={handleShippingMethodChange}
                    />
                  )}

                  {checkout?.is_sameday && (
                    <ShippingMethodItemCard
                      item={{
                        id: "sameday",
                        description: checkout?.same_delivery_message,
                        title: "Sameday Delivery",
                        price: checkout?.sameday_delivery_price,
                        imageUrl: ImagePath.sameDay,
                      }}
                      selectedShippingMethod={selectedShippingMethod}
                      handleShippingMethodChange={handleShippingMethodChange}
                    />
                  )}
                </div>
              )}
            </Box>
            <Box sx={container}>
              {checkout && (
                <>
                  <Typography sx={title} gutterBottom variant="h6">
                    {t("payment_method")}
                  </Typography>
                  <hr className="border-gray-300 mb-3" />
                  {checkout.payment_method_list
                    ?.filter((status) => status.status)
                    .map(
                      (item) =>
                        item.status && (
                          <PaymentMethodItemCard
                            key={item.id}
                            item={item}
                            selectedPaymentMethod={selectedPaymentMethod}
                            setSelectedPaymentMethod={setSelectedPaymentMethod}
                            handlePaymentMethodChange={
                              handlePaymentMethodChange
                            }
                          />
                        ),
                    )}
                  {discountData?.final_order_total_price && discountData?.final_order_total_price > 0 ? (
                    <TabbyTamaraWidget
                      finalAmount={discountData?.final_order_total_price || discountData?.total_amount}
                      currencyCode={currency}
                      locale={params.locale || 'en'}
                    />
                  ) : null}


                  <Box sx={paymentMethodBox}>
                    <Checkbox
                      checkedIcon={
                        <CheckBoxSharp
                          sx={{ color: COLORS.primary, height: 30, width: 30 }}
                        />
                      }
                      icon={
                        <CheckBoxOutlineBlankSharp
                          sx={{ color: "#e0e0e0", height: 30, width: 30 }}
                        />
                      }
                      value={checkedTerms}
                      onChange={(event) =>
                        setCheckedTerms(event.target.checked)
                      }
                      sx={checkboxStyle}
                    />
                    <Typography
                      onClick={navigateToTermsCondactions}
                      sx={termsText}
                    >
                      {t("trems_conditions")}
                    </Typography>
                  </Box>
                </>
              )}
              <Grid sx={{ my: 2 }} item xs={12}>
                <Button
                  onClick={async () => {
                    const errors = await formikRef.current?.validateForm();
                    if (Object.keys(errors).length === 0) {
                      payOrder();
                    } else {
                      Object.keys(errors).forEach((key) => {
                        if (errors[key]) showToast("error", errors[key]);
                      });
                    }
                  }}
                  disabled={placingLoading}
                  fullWidth
                  variant="contained"
                  startIcon={
                    placingLoading && (
                      <CircularProgress color="inherit" size={20} />
                    )
                  }
                  sx={{ backgroundColor: COLORS.primary }}
                >
                  {placingLoading ? t("placing_order") : t("place_order")}
                </Button>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Login
        open={openLogin}
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
    </Box>
  );
};
export default Checkout;
