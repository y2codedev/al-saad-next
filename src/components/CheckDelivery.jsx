import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CheckDelivery = ({
  open,
  handleClose,
  handleCityChange,
  handleAreaChange,
  Check,
  cities,
  areas,
  city,
  area,
}) => {

  return (
    <Modal open={open} onClose={handleClose} disableScrollLock>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: 400, md: 500 },
            bgcolor: "background.paper",
            boxShadow: 24,
            px: 3,
            py: 2,
            borderRadius: 1,
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Check Delivery
            </Typography>
            <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography>City</Typography>
            <Select
              value={city || "select"}
              onChange={handleCityChange}
              variant="outlined"
              fullWidth
            >
              <MenuItem value="select" disabled>
                Select a city
              </MenuItem>
              {cities?.map((city) => (
                <MenuItem key={city?.id} value={city?.id?.toString()}>
                  {city?.city_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography>Area</Typography>
            <Select
              disabled={!city}
              value={area || "select"}
              onChange={handleAreaChange}
              variant="outlined"
              fullWidth
            >
              <MenuItem value="select" disabled>
                Select an area
              </MenuItem>
              {areas?.map((area) => (
                <MenuItem key={area?.id} value={area?.id?.toString()}>
                  {area?.area_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            onClick={() => {
              Check();
              handleClose();
            }}
            sx={{
              backgroundColor: "#bb1f2a",
              color: "white",
              px: 4,
              display: "flex",
              justifySelf: "end",
            }}
          >
            Check
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CheckDelivery;
