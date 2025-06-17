import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import COLORS from "@/utils/colors";

const ShippingAddressDialog = ({
  open,
  onClose,
  addresses,
  selectedAddress,
  setSelectedAddress,
  setValues,
  fetchCheckOut,
  couponCode,
  getArea
}) => {
  return (
    <Dialog
      disablePortal
      disableScrollLock
      MenuProps={{ disableScrollLock: true }}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Shipping Address</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{}}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {addresses && addresses?.length > 0 ? (
        <DialogContent>
          <Box sx={{ height: "400px", width: "100%", overflow: "auto" }}>
            {/* Header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 2,
                alignItems: "center",
              }}
            >
              {["Country", "City", "Area", "Address", "Select"].map(
                (header, index) => (
                  <Typography
                    key={index}
                    sx={{
                      fontWeight: "600",
                      fontSize: "16px",
                      textAlign: index === 4 ? "center" : "left",
                    }}
                  >
                    {header}
                  </Typography>
                ),
              )}
            </Box>

            {/* Data Rows */}
            {addresses?.map((item) => (
              <Box
                key={item?.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 2,
                  my: 1,
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  py: 1,
                }}
              >
                {[
                  item?.country,
                  item?.city,
                  item?.area || "N/A",
                  item?.address.split(" ").slice(0, 5).join(" ") +
                  (item?.address.split(" ").length > 5 ? "..." : ""),
                ].map((text, index) => (
                  <Typography
                    key={index}
                    sx={{
                      color: "#292b2c",
                      textTransform: "capitalize",
                      fontSize: { sm: "16px", xs: "14px" },
                    }}
                  >
                    {text}
                  </Typography>
                ))}

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: COLORS.primary,
                    color: "#fff",
                    width: "100px",
                    textTransform: "capitalize",
                    fontSize: { sm: "16px", xs: "14px" },
                    justifySelf: "center",
                  }}
                  onClick={() => {
                    onClose();
                    setSelectedAddress(item);
                    setValues({
                      ...item,
                      address: item.address,
                      name: item.name,
                      mobile_number: item.mobile_number,
                      alternate_number: item.alternate_number,
                      email: item.email,
                      country_code: item.country_code,
                      country_id: item.country_id,
                      city_id: item.city_id,
                      area_id: item.area_id,
                    });
                    fetchCheckOut(item, couponCode);
                    getArea(item.city_id);
                  }}
                >
                  {item?.id === selectedAddress?.id ? "Selected" : "Select"}
                </Button>
              </Box>
            ))}
          </Box>
        </DialogContent>
      ) : (
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "400px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#292b2c", fontSize: "16px", textAlign: "center" }}
            >
              No address found
            </Typography>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ShippingAddressDialog;
