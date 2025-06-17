"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  CircularProgress,
  FormHelperText,
  Typography,
} from "@mui/material";
import Dashboard from "@/components/dashboard/Dashboard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLoadScript } from "@react-google-maps/api";
import { shippingApi } from "@/utils/services/shippingApi";
import _ from "lodash";
import { google_place_api, showToast } from "@/utils/helper";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  DashBox,
  StyledHeading,
} from "@/components/styles";
import { useSettingsStore } from "@/store/useSettingsStore";
import COLORS from "@/utils/colors";
import { useCountryStore } from "@/store/useCountryStore";
import styles from "@/components/Map/styles";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import ChekOutMap from "@/components/Map/ChekOutMap";
import { useTranslations } from "next-intl";

const AddEditAddress = () => {
  const [dailog, setDailog] = useState(false);
  const { id } = useParams();
  const t = useTranslations();
  const [city, setCity] = useState(null);
  const [area, setArea] = useState(null);
  const formikRef = useRef(null);
  const [areaLoading, setAreaLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpenDailog = () => setDailog(true);
  const handleCloseDailog = () => setDailog(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 23.8859,
    lng: 45.0792,
  });
  const { countries, fetchCountries } = useCountryStore();
  const { selectedCountry, setSelectedCountry } = useSettingsStore();
  const router = useRouter();
  const values = {
    country_id: selectedCountry?.id,
    city_id: "",
    area_id: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
    note: "",
    name: "",
    mobile_number: "",
    alternate_number: "",
    email: "",
    is_default: "",
    country_code: selectedCountry?.code || "",
  };
  const [initialValues, setInitialValues] = useState(values);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    mobile_number: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
    country_id: Yup.string().required("Country is required"),
    area_id: Yup.string().required("Area is required"),
    city_id: Yup.string().required("City is required"),
  });

  const getCity = async () => {
    try {
      let req = { country_id: selectedCountry?.id };
      const response = await shippingApi.getCity(req);
      if (response && response.status === 200) {
        await getArea();
        setCity(response.data);
      } else {
        console.log("Error fetching city data:-", response);
      }
    } catch (error) {
      console.log("Error fetching city data:-", error);
    }
  };

  useEffect(() => {
    getCity();
  }, [selectedCountry]);

  const getArea = async (id) => {
    if (!id) return;
    try {
      setAreaLoading(true);
      let req = {
        country_id: selectedCountry?.id,
        city_id: id,
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

  const debouncedGetArea = useCallback(
    _.debounce((id) => getArea(id), 300),
    [],
  );

  useEffect(() => {
    if (initialValues?.city_id) {
      debouncedGetArea(initialValues?.city_id);
    }
  }, [initialValues?.city_id]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: google_place_api,
    libraries: ["places"],
  });

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
    if (isLoaded) {
      getLocation();
    }
  }, [getLocation, isLoaded]);

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
      if (!results.length) return console.log("Address not found");

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

  const addNewAddress = async (values, resetForm) => {
    const request = {
      country_id: values.country_id,
      city_id: values.city_id,
      area_id: values.area_id,
      area: values.area,
      address: values.address,
      latitude: currentLocation?.lat,
      longitude: currentLocation?.lng,
      note: values.note,
      name: values.name,
      mobile_number: values.mobile_number,
      alternate_number: values.alternate_number,
      email: values.email,
      is_default: values.is_default ? 1 : 0,
      country_code: selectedCountry?.code,
    };
    setLoading(true);
    try {
      const response = id
        ? await shippingApi.updateShippingAddress({
            ...request,
            shipping_address_id: id,
          })
        : await shippingApi.addShippingAddress(request);

      if (response?.status === 200) {
        showToast("success", response.message);
        resetForm();
        formikRef.current?.resetForm();
        router.push("/my-address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setLoading(false);
    }
  };

  const getShipping = async () => {
    if (!id) {
      return;
    }
    try {
      const response = await shippingApi.getShippingAddressById({
        shipping_address_id: id,
      });
      if (response && response.status === 200) {
        setInitialValues(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShipping();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>
              {id ? t("update_address") : t("add_address")}{" "}
            </StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: "Home" },
                { text: id ? t("update_address") : t("add_address"), link: "" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2} mt={"10px"} mb={"50px"}>
          <Grid
            size={{
              xs: 12,
              sm: 3,
            }}
          >
            <Box
              sx={{ bgcolor: "white", boxShadow: "0 0 10px rgb(0 0 0 / 20%)" }}
            >
              <Dashboard selectItem={3} />
            </Box>
          </Grid>

          <Grid
            sx={{ mb: 10 }}
            size={{
              xs: 12,
              sm: 9,
            }}
          >
            <DashBox>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#292b2c",
                    textTransform: "capitalize",
                    fontWeight: 700,
                    fontSize: { sm: "24px", xs: "16px" },
                    pt: 2,
                    px: 2,
                  }}
                >
                  {id ? t("update_address") : t("add_address")}
                </Typography>
              </Box>
              <hr className=" text-gray-300 mt-1" />
              <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  addNewAddress(values, resetForm);
                }}
                enableReinitialize
              >
                {({
                  handleChange,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  setErrors,
                }) => {
                  return (
                    <form onSubmit={handleSubmit}>
                      <Box p={2}>
                        <TextField
                          name="name"
                          value={values?.name}
                          onChange={handleChange}
                          fullWidth
                          placeholder={t("name")}
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          error={touched?.name && Boolean(errors?.name)}
                          helperText={touched?.name && errors?.name}
                        />

                        <Grid container spacing={2} mt={1}>
                          <Grid
                            size={{
                              xs: 4,
                              sm: 3,
                            }}
                          >
                            <FormControl fullWidth>
                              <Select
                                disabled
                                disablePortal
                                MenuProps={{ disableScrollLock: true }}
                                value={selectedCountry?.code || ""}
                                variant="outlined"
                                sx={{
                                  padding: "2px 4px",
                                  border: "1px solid #ccc",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                  },
                                  ".MuiSelect-select": {
                                    padding: "13px 0px",
                                    fontSize: "14px",
                                    color: "#333",
                                    display: "flex",
                                    alignItems: "center",
                                  },
                                }}
                              >
                                <MenuItem value={selectedCountry?.code || ""}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={selectedCountry?.flag}
                                      alt={selectedCountry?.name}
                                      style={{
                                        width: "23px",
                                        height: "23px",
                                        marginRight: "8px",
                                      }}
                                    />
                                    <span>{selectedCountry?.code}</span>
                                  </Box>
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid
                            size={{
                              xs: 8,
                              sm: 9,
                            }}
                          >
                            <TextField
                              name="mobile_number"
                              value={values.mobile_number}
                              onChange={handleChange}
                              fullWidth
                              type="number"
                              placeholder={t("mobile_number")}
                              error={
                                touched.mobile_number &&
                                Boolean(errors.mobile_number)
                              }
                              helperText={
                                touched.mobile_number && errors.mobile_number
                              }
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          <Grid
                            size={{
                              xs: 4,
                              sm: 3,
                            }}
                          >
                            <FormControl fullWidth>
                              <Select
                                disabled
                                disablePortal
                                MenuProps={{ disableScrollLock: true }}
                                value={selectedCountry?.code || ""}
                                variant="outlined"
                                sx={{
                                  padding: "2px 4px",
                                  border: "1px solid #ccc",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                  },
                                  ".MuiSelect-select": {
                                    padding: "13px 0px",
                                    fontSize: "14px",
                                    color: "#333",
                                  },
                                }}
                              >
                                <MenuItem value={selectedCountry.code}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={selectedCountry?.flag}
                                      alt={selectedCountry?.name}
                                      style={{
                                        width: "23px",
                                        height: "23px",
                                        marginRight: "8px",
                                      }}
                                    />
                                    <span>{selectedCountry?.code}</span>
                                  </Box>
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid
                            size={{
                              xs: 8,
                              sm: 9,
                            }}
                          >
                            <TextField
                              name="alternate_number"
                              value={values.alternate_number}
                              onChange={handleChange}
                              fullWidth
                              type="number"
                              placeholder={t("alt_number")}
                              error={
                                touched.alternate_number &&
                                Boolean(errors.alternate_number)
                              }
                              helperText={
                                touched.alternate_number &&
                                errors.alternate_number
                              }
                            />
                          </Grid>
                        </Grid>

                        <TextField
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          fullWidth
                          placeholder={t("email")}
                          variant="outlined"
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          sx={{ my: 2 }}
                        />

                        <FormControl fullWidth>
                          <Select
                            disabled
                            disablePortal
                            MenuProps={{ disableScrollLock: true }}
                            fullWidth
                            variant="outlined"
                            value={selectedCountry?.country_name || ""}
                            onChange={(event) => {
                              const selectedCountry = countries.find(
                                (country) =>
                                  country.country_name === event.target.value,
                              );
                              setSelectedCountry(selectedCountry);
                            }}
                            sx={{ marginBottom: 2 }}
                          >
                            {countries?.length > 0 &&
                              countries?.map((country, index) => (
                                <MenuItem
                                  key={index}
                                  value={country.country_name}
                                  sx={{
                                    fontSize: 14,
                                    ":hover": {
                                      backgroundColor: COLORS.primary,
                                      color: "#fff",
                                    },
                                  }}
                                >
                                  {country?.country_name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>

                        <FormControl fullWidth>
                          <Select
                            disablePortal
                            MenuProps={{ disableScrollLock: true }}
                            fullWidth
                            variant="outlined"
                            value={values.city_id || "Select City"}
                            onChange={(e) => {
                              setFieldValue("city_id", e.target.value);
                              setFieldValue("area_id", "");
                              getArea(e.target.value);
                              setErrors("city_id", "");
                            }}
                            sx={
                              touched?.city_id && errors?.city_id
                                ? {}
                                : styles.textField
                            }
                          >
                            <MenuItem disabled value="Select City">
                              {t("select_city")}
                            </MenuItem>
                            {city?.length > 0 &&
                              city?.map((item) => (
                                <MenuItem key={item?.id} value={item?.id}>
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
                            disablePortal
                            MenuProps={{ disableScrollLock: true }}
                            fullWidth
                            variant="outlined"
                            value={values.area_id || "Select Area"}
                            onChange={(e) =>
                              setFieldValue("area_id", e.target.value)
                            }
                            disabled={!values.city_id}
                            error={touched?.area_id && Boolean(errors?.area_id)}
                            sx={
                              touched?.area_id && errors?.area_id
                                ? {}
                                : styles.textField
                            }
                          >
                            <MenuItem disabled value="Select Area">
                              {t("select_area")}
                            </MenuItem>
                            {area?.length > 0 &&
                              area?.map((item) => (
                                <MenuItem key={item?.id} value={item?.id}>
                                  {item?.area_name}
                                </MenuItem>
                              ))}
                          </Select>
                          {touched?.area_id && errors?.area_id && (
                            <FormHelperText sx={styles.textField} error>
                              {errors?.area_id}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <TextField
                          name="note"
                          value={values?.note}
                          onChange={handleChange}
                          fullWidth
                          placeholder={t("note")}
                          variant="outlined"
                          sx={{ marginBottom: 2 }}
                          error={touched.note && Boolean(errors.note)}
                          helperText={touched.note && errors.note}
                        />

                        <Box>
                          <TextField
                            fullWidth
                            placeholder={t("add_address")}
                            variant="outlined"
                            name="address"
                            value={values?.address}
                            onChange={handleChange}
                            error={touched.address && Boolean(errors.address)}
                            helperText={touched.address && errors.address}
                            sx={{ marginBottom: 2 }}
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

                        <FormControlLabel
                          control={
                            <Checkbox
                              name="is_default"
                              onChange={(e) =>
                                setFieldValue("is_default", e.target.checked)
                              }
                              checked={!!values.is_default}
                              sx={{
                                "&.Mui-checked": {
                                  color: COLORS.primary,
                                },
                              }}
                            />
                          }
                          label={t("default")}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            mt: 2,
                          }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                              backgroundColor: COLORS.primary,
                              borderRadius: "2px",
                            }}
                          >
                            {!loading ? t("save_address") : t("saving")}
                          </Button>
                        </Box>
                      </Box>
                      <ChekOutMap
                        dailog={dailog}
                        handleCloseDailog={handleCloseDailog}
                        onPlaceChanged={locationSelected}
                        address={values.address}
                        setAddress={setFieldValue}
                        currentLocation={currentLocation}
                        handleDragEnd={handleDragEnd}
                        selectedCountry={selectedCountry}
                      />
                    </form>
                  );
                }}
              </Formik>
            </DashBox>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AddEditAddress;
