"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import { google_place_api } from "@/utils/helper";
import { useCountryStore } from "@/store/useCountryStore";
import { useSettingsStore } from "@/store/useSettingsStore";

const ChekOutMap = ({
  dailog,
  handleCloseDailog,
  onPlaceChanged,
  address,
  setAddress,
  currentLocation,
  handleDragEnd,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: google_place_api,
    libraries: ["places"],
  });

  const { selectedCountry } = useSettingsStore();

  const [autocomplete, setAutocomplete] = useState(null);

  function onLoad(autocompleteInstance) {
    setAutocomplete(autocompleteInstance);
  }

  if (!isLoaded) return <div></div>;

  return (
    <Dialog
      disableScrollLock
      disablePortal
      MenuProps={{ disableScrollLock: true }}
      open={dailog}
      onClose={handleCloseDailog}
      fullWidth
      maxWidth="sm"
    >
      <Box sx={{}}>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseDailog}
          aria-label="close"
          sx={{ position: "absolute", right: 15, top: 5 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ mt: 3, p: 4 }}>
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={() => onPlaceChanged(autocomplete)}
            options={{
              componentRestrictions: { country:  selectedCountry?.currency_code?.substring(0, 2) || "SA"},
            }}
          >
            <TextField
              value={address}
              onChange={(e) => setAddress("address", e.target.value)}
              placeholder="Enter a location"
              variant="outlined"
              sx={{ marginBottom: 2, width: "100%" }}
            />
          </Autocomplete>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ height: "400px", width: "100%" }}>
            <GoogleMap
              center={currentLocation}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              zoom={6}
              options={{
                draggable: true,
                scrollwheel: false,
                keyboardShortcuts: false,
                mapTypeControl: false,
                fullscreenControl: false,
                zoomControl: true,
                streetViewControl: false,
                controlSize: 25,
              }}
            >
              <Marker
                position={currentLocation}
                draggable={true}
                onDragEnd={handleDragEnd}
              />
            </GoogleMap>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ChekOutMap;
