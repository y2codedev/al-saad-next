import COLORS from "@/utils/colors";

const styles = {
  box: {
    my: 2,
    py: 2,
    px: 3,
    display: "flex",
    alignItems: "center",
    gap: 1,
    backgroundColor: "#f7f7f7",
  },
  text: {
    fontSize: { sm: "16px", xs: "14px" },
  },
  loginText: {
    fontSize: { sm: "16px", xs: "14px" },
    color: "#000",
    ":hover": { cursor: "pointer", color: COLORS.primary },
  },
  containerBox: {
    border: { sm: "1px solid #ddd", xs: "none" },
    padding: { sm: 3, xs: 0 },
  },
  gridContainer: {
    // gap: { sm: 2, xs: 0 },
  },
  textFieldCoupon: {
    height: "52px",
    borderRadius: "0px ",
    "& .MuiOutlinedInput-root": {
      height: "100%",
      borderRadius: 0,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: 0,
    },
  },
  button: (appliedCoupon) => ({
    borderRadius: { sm: 0, xs: "0 8px 8px 0" },
    height: "52px",
    padding: 0,
    backgroundColor: appliedCoupon ? "green" : COLORS.primary,
    "&:disabled": {
      backgroundColor: COLORS.primary,
      opacity: 0.7,
      color: COLORS.white,
    },
  }),
  loaderBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    color: "white",
  },
  wrapper: {
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    my: { xs: 2, sm: 4 },
  },
  line: {
    flex: 1,
    height: "4px",
    backgroundColor: "#d9d9d9",
  },
  icon: {
    margin: "0 16px",
    color: "#d9d9d9",
  },
  sectionTitle: {
    color: "#292b2c",
    fontSize: "22px",
    fontWeight: "700",
    mb: 4,
  },
  selectBox: {
    padding: "2px 4px",
    border: "1px solid #ccc",
    ".MuiOutlinedInput-notchedOutline": { border: "none" },
    ".MuiSelect-select": {
      padding: "13px 0px",
      fontSize: "14px",
      color: "#333",
    },
  },
  textField: { marginBottom: 2 },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: { sm: 2, xs: 0 },
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    mt: 2,
  },
  countrySelect: { marginBottom: 2 },
  menuItem: {
    fontSize: 14,
    ":hover": { backgroundColor: COLORS.primary, color: "#fff" },
  },
};

export default styles;
