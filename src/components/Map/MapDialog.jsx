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
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const initialCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const MapDialog = ({ dailog, handleCloseDailog }) => {
  const [address, setAddress] = useState("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC9I1jxk50uXTehTGZMDM-J69mYeJh1xdg",
    libraries: ["places"],
  });

  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const { lat, lng } = place.geometry.location;
        setMapCenter({
          lat: lat(),
          lng: lng(),
        });
        setAddress(place.formatted_address || "");
      } else {
        console.error("No geometry found for this place.");
      }
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Dialog
      disablePortal
      MenuProps={{ disableScrollLock: true }}
      open={dailog}
      onClose={handleCloseDailog}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <TextField
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            label="Enter a location"
            variant="outlined"
            sx={{ width: "90%", marginBottom: 2 }}
          />
        </Autocomplete>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseDailog}
          aria-label="close"
          sx={{ position: "absolute", right: "20px", top: "20px" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ height: "400px", width: "100%" }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={6}
            center={mapCenter}
            options={options}
          >
            <Marker position={mapCenter} />
          </GoogleMap>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
