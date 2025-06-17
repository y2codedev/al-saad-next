// styles/checkoutStyled.js
export const container = {
  border: "1px solid #e0e0e0",
  borderRadius: "5px",
  marginY: 4,
  padding: 2,
  backgroundColor: "#f7f8fb",
};

export const title = {
  color: "#292b2c",
  fontSize: { xs: "18px", md: "22px" },
  fontWeight: "700",
};

export const paymentMethodBox = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const checkboxStyle = {
  padding: 0,
  "&.Mui-checked": {
    color: "#007bff", // Replace with your primary color
  },
};

export const termsText = {
  fontSize: { sm: "16px", xs: "14px" },
  cursor: "pointer",
  textDecoration: "underline",
  "&:hover": {
    color: "#007bff", // Replace with your primary color
  },
};
